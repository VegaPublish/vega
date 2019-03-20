import ConfigStore from 'configstore'

const lyraEnv = (process.env.LYRA_ENV || '').toLowerCase() // eslint-disable-line no-process-env
const defaults = {}
let config = null

const getUserConfig = () => {
  if (!config) {
    config = new ConfigStore(
      lyraEnv && lyraEnv !== 'production' ? `lyra-${lyraEnv}` : 'lyra',
      defaults,
      {globalConfigPath: true}
    )
  }

  return config
}

export default getUserConfig
