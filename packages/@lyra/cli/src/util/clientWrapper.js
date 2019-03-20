import client from '@lyra/client'
import getUserConfig from './getUserConfig'

/* eslint-disable no-process-env */
const envAuthToken = process.env.LYRA_AUTH_TOKEN
const lyraEnv = process.env.LYRA_ENV || 'production'
/* eslint-enable no-process-env */

const apiHosts = {
  staging: 'https://api.lyra.work',
  development: 'http://api.lyra.wtf'
}

/**
 * Creates a wrapper/getter function to retrieve a Lyra API client.
 * Instead of spreading the error checking logic around the project,
 * we call it here when (and only when) a command needs to use the API
 */
const defaults = {
  requireUser: true,
  requireProject: true
}

const authErrors = () => ({
  onError: err => {
    if (envAuthToken || !err || !err.response) {
      return err
    }

    const body = err.response.body
    if (!body || body.statusCode !== 401) {
      return err
    }

    const cfg = getUserConfig()
    cfg.delete('authType')
    cfg.delete('authToken')

    // @todo Trigger re-authentication?
    return err
  }
})

export default function clientWrapper(manifest, configPath) {
  const requester = client.requester.clone()
  requester.use(authErrors())

  return function(opts = {}) {
    const {requireUser, requireProject, api} = {...defaults, ...opts}
    const userConfig = getUserConfig()
    const userApiConf = userConfig.get('api')
    const token = envAuthToken || userConfig.get('authToken')
    const apiHost = apiHosts[lyraEnv]
    const apiConfig = Object.assign(
      {},
      userApiConf || {},
      (manifest && manifest.api) || {},
      api || {}
    )

    if (apiHost) {
      apiConfig.apiHost = apiHost
    }

    if (requireUser && !token) {
      throw new Error('You must login first - run "lyra login"')
    }

    if (requireProject && !apiConfig.apiHost) {
      throw new Error(
        `"${configPath}" does not contain a project identifier ("api.apiHost"), ` +
          'which is required for the Lyra CLI to communicate with the Lyra API'
      )
    }

    return client({
      ...apiConfig,
      dataset: apiConfig.dataset || 'dummy',
      token: token,
      useProjectHostname: requireProject,
      requester: requester,
      useCdn: false
    })
  }
}
