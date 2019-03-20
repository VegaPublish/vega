import os from 'os'
import util from 'util'
import path from 'path'
import osenv from 'osenv'
import fse from 'fs-extra'
import xdgBasedir from 'xdg-basedir'
import promiseProps from 'promise-props-recursive'
import {pick, omit} from 'lodash'
import getUserConfig from '../../util/getUserConfig'
import {printResult as printVersionsResult} from '../versions/printVersionResult'
import findLyraModuleVersions from '../../actions/versions/findLyraModuleVersions'

export default async (args, context) => {
  const flags = args.extOptions
  const {
    user,
    globalConfig,
    projectConfig,
    project,
    versions
  } = await gatherInfo(context)
  const {chalk} = context

  // User info
  context.output.print('\nUser:')
  if (user instanceof Error) {
    context.output.print(`  ${chalk.red(user.message)}\n`)
  } else {
    printKeyValue({ID: user.id, Name: user.name, Email: user.email}, context)
  }

  // Project info (API-based)
  if (project) {
    context.output.print('Project:')
    printKeyValue(
      {
        ID: project.id,
        'Display name': project.displayName,
        'Studio URL': project.studioHostname || project.studioHost,
        'User role': project.userRole
      },
      context
    )
  }

  // Auth info
  // eslint-disable-next-line no-process-env
  const authToken = process.env.LYRA_AUTH_TOKEN || globalConfig.authToken
  if (authToken) {
    context.output.print('Authentication:')
    printKeyValue(
      {
        'User type': globalConfig.authType || 'normal',
        'Auth token': flags.secrets ? authToken : `<redacted>`
      },
      context
    )

    if (!flags.secrets) {
      context.output.print('  (run with --secrets to reveal token)\n')
    }
  }

  // Global configuration (user home dir config file)
  context.output.print(
    `Global config (${chalk.yellow(getGlobalConfigLocation())}):`
  )
  const globalCfg = omit(globalConfig, ['authType', 'authToken'])
  context.output.print(`  ${formatObject(globalCfg).replace(/\n/g, '\n  ')}\n`)

  // Project configuration (projectDir/lyra.json)
  if (projectConfig) {
    const configLocation = path.join(context.workDir, 'lyra.json')
    context.output.print(`Project config (${chalk.yellow(configLocation)}):`)
    context.output.print(
      `  ${formatObject(projectConfig).replace(/\n/g, '\n  ')}`
    )
  }

  // Print installed package versions
  if (versions) {
    context.output.print('\nPackage versions:')
    printVersionsResult(versions, line => context.output.print(`  ${line}`))
    context.output.print('')
  }
}

function formatObject(obj) {
  return util.inspect(obj, {colors: true, depth: +Infinity})
}

function printKeyValue(obj, context) {
  let printedLines = 0
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] !== 'undefined') {
      context.output.print(`  ${key}: ${formatObject(obj[key])}`)
      printedLines++
    }
  })

  if (printedLines > 0) {
    context.output.print('')
  }
}

async function gatherInfo(context) {
  const baseInfo = await promiseProps({
    globalConfig: gatherGlobalConfigInfo(context),
    projectConfig: gatherProjectConfigInfo(context)
  })

  baseInfo.user = await gatherUserInfo(context, {
    projectBased: Boolean(baseInfo.projectConfig && baseInfo.projectConfig.api)
  })

  return promiseProps(
    Object.assign(
      {
        project: gatherProjectInfo(context, baseInfo),
        versions: findLyraModuleVersions(context)
      },
      baseInfo
    )
  )
}

function getGlobalConfigLocation() {
  const user = (osenv.user() || 'user').replace(/\\/g, '')
  const configDir = xdgBasedir.config || path.join(os.tmpdir(), user, '.config')
  return path.join(configDir, 'lyra', 'config.json')
}

function gatherGlobalConfigInfo(context) {
  return getUserConfig().all
}

async function gatherProjectConfigInfo(context) {
  const workDir = context.workDir
  const configLocation = path.join(workDir, 'lyra.json')

  try {
    return await fse.readJson(configLocation)
  } catch (err) {
    return err.code === 'ENOENT' ? null : {error: err}
  }
}

async function gatherUserInfo(context, info = {}) {
  const client = context.apiClient({
    requireUser: false,
    requireProject: info.projectBased
  })
  const hasToken = Boolean(client.config().token)
  if (!hasToken) {
    return new Error('Not logged in')
  }

  const userInfo = await client.users.getById('me')
  if (!userInfo) {
    return new Error('Token expired or invalid')
  }

  return pick(userInfo, ['id', 'name', 'email'])
}
