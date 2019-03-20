#!/usr/bin/env node

/* eslint-disable id-length, no-console, no-process-env */
const fs = require('fs')
const ora = require('ora')
const get = require('simple-get')
const meow = require('meow')
const prettyMs = require('pretty-ms')
const lyraClient = require('@lyra/client')
const lyraImport = require('@lyra/import')

const red = str => `\u001b[31mERROR: ${str}\u001b[39m`
const error = str => console.error(red(str))

const cli = meow(
  `
  Usage
    $ lyra-import -a <api host> -d <dataset> -t <token> sourceFile.ndjson

  Options
    -a, --api <projectId> Project ID to import to
    -d, --dataset <dataset> Dataset to import to
    -t, --token <token> Token to authenticate with
    --replace Replace documents with the same IDs
    --missing Skip documents that already exist
    --help Show this help

  Examples
    # Import "./my-dataset.ndjson" into dataset "staging"
    $ lyra-import -p myPrOj -d staging -t someSecretToken my-dataset.ndjson

    # Import into dataset "test" from stdin, read token from env var
    $ cat my-dataset.ndjson | lyra-import -p myPrOj -d test -

  Environment variables (fallbacks for missing flags)
    --token = LYRA_IMPORT_TOKEN
`,
  {
    boolean: ['replace', 'missing'],
    alias: {
      p: 'project',
      d: 'dataset',
      t: 'token'
    }
  }
)

const {flags, input, showHelp} = cli
const token = flags.token || process.env.LYRA_IMPORT_TOKEN
const apiHost = flags.host
const dataset = flags.dataset
const source = input[0]

if (!apiHost) {
  error('Flag `--api` is required')
  showHelp()
}

if (!dataset) {
  error('Flag `--dataset` is required')
  showHelp()
}

if (!token) {
  error('Flag `--token` is required (or set LYRA_IMPORT_TOKEN)')
  showHelp()
}

if (!source) {
  error('Source file is required, use `-` to read from stdin')
  showHelp()
}

let operation = 'create'
if (flags.replace || flags.missing) {
  if (flags.replace && flags.missing) {
    error('Cannot use both `--replace` and `--missing`')
    showHelp()
  }

  operation = flags.replace ? 'createOrReplace' : 'createIfNotExists'
}

let currentStep
let currentProgress
let stepStart
let spinInterval

const client = lyraClient({
  apiHost,
  dataset,
  token,
  useCdn: false
})

getStream()
  .then(stream => lyraImport(stream, {client, operation, onProgress}))
  .then(imported => {
    const timeSpent = prettyMs(Date.now() - stepStart, {secDecimalDigits: 2})
    currentProgress.text = `[100%] ${currentStep} (${timeSpent})`
    currentProgress.succeed()

    console.log(
      'Done! Imported %d documents to dataset "%s"',
      imported,
      dataset
    )
  })
  .catch(err => {
    error(err.message)
  })

function getStream() {
  if (/^https:\/\//i.test(source)) {
    return getUriStream(source)
  }

  return Promise.resolve(
    source === '-' ? process.stdin : fs.createReadStream(source)
  )
}

function getUriStream(uri) {
  return new Promise((resolve, reject) => {
    get(source, (err, res) => {
      if (err) {
        reject(new Error(`Error fetching source:\n${err.message}`))
        return
      }

      if (res.statusCode !== 200) {
        reject(new Error(`Error fetching source: HTTP ${res.statusCode}`))
        return
      }

      resolve(res)
    })
  })
}

function onProgress(opts) {
  const lengthComputable = opts.total
  const sameStep = opts.step == currentStep
  const percent = getPercentage(opts)

  if (lengthComputable && opts.total === opts.current) {
    clearInterval(spinInterval)
    spinInterval = null
  }

  if (sameStep && !lengthComputable) {
    return
  }

  if (sameStep) {
    const timeSpent = prettyMs(Date.now() - stepStart, {secDecimalDigits: 2})
    currentProgress.text = `${percent}${opts.step} (${timeSpent})`
    currentProgress.render()
    return
  }

  // Moved to a new step
  const prevStep = currentStep
  const prevStepStart = stepStart
  stepStart = Date.now()
  currentStep = opts.step

  if (spinInterval) {
    clearInterval(spinInterval)
    spinInterval = null
  }

  if (currentProgress && currentProgress.succeed) {
    const timeSpent = prettyMs(Date.now() - prevStepStart, {
      secDecimalDigits: 2
    })
    currentProgress.text = `[100%] ${prevStep} (${timeSpent})`
    currentProgress.succeed()
  }

  currentProgress = ora(`[0%] ${opts.step} (0.00s)`).start()

  if (!lengthComputable) {
    spinInterval = setInterval(() => {
      const timeSpent = prettyMs(Date.now() - prevStepStart, {
        secDecimalDigits: 2
      })
      currentProgress.text = `${percent}${opts.step} (${timeSpent})`
      currentProgress.render()
    }, 60)
  }
}

function getPercentage(opts) {
  if (!opts.total) {
    return ''
  }

  const percent = Math.floor((opts.current / opts.total) * 100)
  return `[${percent}%] `
}
