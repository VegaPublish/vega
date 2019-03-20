import os from 'os'
import path from 'path'
import fse from 'fs-extra'
import resolveFrom from 'resolve-from'
import deburr from 'lodash/deburr'
import debug from '../../debug'
import getProjectDefaults from '../../util/getProjectDefaults'
import dynamicRequire from '../../util/dynamicRequire'
import bootstrapTemplate from './bootstrapTemplate'
import templates from './templates'

const slugify = str =>
  deburr(str.toLowerCase())
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9]/g, '')

// eslint-disable-next-line max-statements
export default async function initLyra(args, context) {
  const {output, prompt, workDir, yarn, chalk} = context

  output.print('This utility walks you through creating a Lyra installation.')
  output.print('Press ^C at any time to quit.\n')

  const projectName = await prompt.single({
    message: 'Name of your project:'
  })

  const apiHost = await prompt.single({message: 'Backend API Host:'})

  const sluggedProjectName = slugify(projectName)

  // Now let's pick or create a dataset
  debug('Prompting user to select or create a dataset')
  const defaultVenueName = await prompt.single({
    message: 'Name of default venue (as configured in the backend):'
  })
  const defaultVenueDataset = await prompt.single({
    message: 'Name of dataset for default venue:',
    default: slugify(defaultVenueName)
  })

  debug(`Dataset with name ${defaultVenueDataset} selected`)

  // Gather project defaults based on environment
  const defaults = await getProjectDefaults(workDir, {isPlugin: false, context})

  // Prompt the user for required information
  const answers = await getProjectInfo()

  // Ensure we are using the output path provided by user
  const outputPath = answers.outputPath || workDir

  // Prompt for template to use
  const templateName = await selectProjectTemplate()

  // Build a full set of resolved options
  const initOptions = {
    template: templateName,
    outputDir: outputPath,
    name: projectName,
    displayName: projectName,
    apiHost,
    defaultVenueName,
    defaultVenueDataset,
    ...answers
  }

  const template = templates[templateName]
  if (!template) {
    throw new Error(`Template "${templateName}" not found`)
  }

  // Bootstrap Lyra, creating required project files, manifests etc
  await bootstrapTemplate(initOptions, context)

  // Now for the slow part... installing dependencies
  try {
    await yarn(['install'], {...output, rootDir: outputPath})
  } catch (err) {
    throw err
  }

  // Make sure we have the required configs
  const coreCommands = dynamicRequire(
    resolveFrom.silent(outputPath, '@lyra/core')
  ).commands
  const configCheckCmd = coreCommands.find(cmd => cmd.name === 'configcheck')
  await configCheckCmd.action(
    {extOptions: {quiet: true}},
    Object.assign({}, context, {
      workDir: outputPath
    })
  )

  output.print(`\n${chalk.green('Success!')} Now what?\n`)

  const isCurrentDir = outputPath === process.cwd()
  if (!isCurrentDir) {
    output.print(`▪ ${chalk.cyan(`cd ${outputPath}`)}, then:`)
  }

  output.print(`▪ ${chalk.cyan('lyra docs')} for documentation`)
  output.print(`▪ ${chalk.cyan('lyra manage')} to open the management tool`)
  output.print(`▪ ${chalk.green('lyra start')} to run your studio\n`)

  // See if the template has a success message handler and print it
  const successMessage = template.getSuccessMessage
    ? template.getSuccessMessage(initOptions, context)
    : ''

  if (successMessage) {
    output.print(`\n${successMessage}`)
  }

  function selectProjectTemplate() {
    return prompt.single({
      message: 'Select project template',
      type: 'list',
      choices: [
        {
          value: 'example-venue',
          name: 'Example venue (with sample plugins)'
        },
        {
          value: 'clean',
          name: 'Clean project with no plugins'
        }
      ]
    })
  }

  async function getProjectInfo() {
    const workDirIsEmpty = (await fse.readdir(workDir)).length === 0
    return {
      description: defaults.description,
      gitRemote: defaults.gitRemote,
      author: defaults.author,
      license: 'UNLICENSED',

      outputPath: await prompt.single({
        type: 'input',
        message: 'Output path:',
        default: workDirIsEmpty
          ? workDir
          : path.join(workDir, sluggedProjectName),
        validate: validateEmptyPath,
        filter: absolutify
      })
    }
  }
}

async function validateEmptyPath(dir) {
  const checkPath = absolutify(dir)
  return (await pathIsEmpty(checkPath)) ? true : 'Given path is not empty'
}

function pathIsEmpty(dir) {
  return fse
    .readdir(dir)
    .then(content => content.length === 0)
    .catch(err => {
      if (err.code === 'ENOENT') {
        return true
      }

      throw err
    })
}

function expandHome(filePath) {
  if (filePath.charCodeAt(0) === 126 /* ~ */) {
    if (filePath.charCodeAt(1) === 43 /* + */) {
      return path.join(process.cwd(), filePath.slice(2))
    }

    const home = os.homedir()
    return home ? path.join(home, filePath.slice(1)) : filePath
  }

  return filePath
}

function absolutify(dir) {
  const pathName = expandHome(dir)
  return path.isAbsolute(pathName)
    ? pathName
    : path.resolve(process.cwd(), pathName)
}
