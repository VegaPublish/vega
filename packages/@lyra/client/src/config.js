const generateHelpUrl = require('@lyra/generate-help-url')
const assign = require('object-assign')
const validate = require('./validators')

const defaultConfig = {
  apiHost: 'https://api.vegapublish.com',
  isPromiseAPI: true
}

exports.defaultConfig = defaultConfig

exports.initConfig = (config, prevConfig) => {
  const newConfig = assign({}, defaultConfig, prevConfig, config)
  if (typeof Promise === 'undefined') {
    const helpUrl = generateHelpUrl('js-client-promise-polyfill')
    throw new Error(
      `No native Promise-implementation found, polyfill needed - see ${helpUrl}`
    )
  }
  if (!newConfig.dataset) {
    throw new Error('Configuration must contain `dataset`')
  }
  if (newConfig.dataset) {
    validate.dataset(newConfig.dataset)
  }
  newConfig.isDefaultApi = newConfig.apiHost === defaultConfig.apiHost
  newConfig.url = `${newConfig.apiHost}/v1`
  return newConfig
}
