/* eslint-disable no-console */
const lyraClient = require('@lyra/client')
const lyraImport = require('@lyra/import')

const PROJECT_ID = 'vega'
const DATASET = 'harlot'
const IMPORT_SOURCE = './harlot.tar.gz'

const TOKEN = decodeURIComponent(process.env.LYRA_TOKEN || '')
if (!TOKEN) {
  console.error(
    'No token provided. Run with `LYRA_TOKEN=<your token> ./scripts/import.js`'
  )
  process.exit(1)
}

const client = lyraClient({
  dataset: DATASET,
  apiHost: 'http://localhost:4000',
  token: TOKEN
})

lyraImport(IMPORT_SOURCE, {
  client: client,
  operation: 'createOrReplace' // `create`, `createOrReplace` or `createIfNotExists`
})
  .then(numDocs => {
    console.log('Imported %d documents', numDocs)
  })
  .catch(err => {
    console.error('Import failed: %s', err.message)
  })
