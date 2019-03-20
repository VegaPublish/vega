const lyraServer = require('@lyra/server')
const wpIntegration = require('@lyra/webpack-integration/v3')
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js')

const skipCssLoader = rule =>
  !rule.test || (rule.test && !rule.test.toString().includes('.css'))
const isCssLoader = rule => rule.test && rule.test.toString().includes('.css')

// This is very hacky, but I couldn't figure out a way to pass config from
// the parent task onto this configuration, which we need to infer the base
// path of the Lyra project in question, along with listener options et all.

// This only works because we never generate this configuration with different
// parameters within the same process, so handle with care, obviously.

let lyraContext = null

function getWebpackConfig(baseConfig, env) {
  /* eslint-disable strict */

  'use strict'

  if (!lyraContext) {
    throw new Error('Lyra context has not been set for Storybook!')
  }

  const wpConfig = Object.assign({}, lyraContext, {commonChunkPlugin: false})
  const lyraWpConfig = lyraServer.getWebpackDevConfig(wpConfig)
  const config = Object.assign({}, genDefaultConfig(baseConfig, env))
  config.plugins = config.plugins.concat(wpIntegration.getPlugins(lyraContext))
  config.module.rules = (config.module.rules || []).concat(
    wpIntegration.getLoaders(lyraContext)
  )
  config.module.rules = config.module.rules.filter(skipCssLoader)
  config.module.rules.unshift(lyraWpConfig.module.rules.find(isCssLoader))

  config.resolve = Object.assign({}, config.resolve, lyraWpConfig.resolve, {
    alias: Object.assign(
      {},
      config.resolve.alias || {},
      lyraWpConfig.resolve.alias || {}
    )
  })
  return config
}

getWebpackConfig.setLyraContext = context => {
  lyraContext = context
}

module.exports = getWebpackConfig
