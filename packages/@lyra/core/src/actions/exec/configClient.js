const ConfigStore = require('configstore')
const client = require('part:@lyra/base/client?')

if (!client) {
  throw new Error(
    '--with-user-token specified, but @lyra/base is not a plugin in this project'
  )
}

// eslint-disable-next-line no-process-env
const lyraEnv = (process.env.LYRA_ENV || '').toLowerCase()
const defaults = {}
const config = new ConfigStore(
  lyraEnv && lyraEnv !== 'production' ? `lyra-${lyraEnv}` : 'lyra',
  defaults,
  {globalConfigPath: true}
)

const token = config.get('authToken')
if (!token) {
  throw new Error(
    '--with-user-token specified, but no auth token could be found. Run `lyra login`'
  )
}

client.config({token})
