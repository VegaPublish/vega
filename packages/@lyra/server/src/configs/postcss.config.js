const resolveProjectRoot = require('@lyra/resolver').resolveProjectRoot
const webpackIntegration = require('@lyra/webpack-integration/v3')

module.exports = {
  plugins: webpackIntegration.getPostcssPlugins({
    basePath: resolveProjectRoot({sync: true}),
    cssnext: {
      features: {
        customProperties: {
          preserve: false
        }
      }
    }
  })
}
