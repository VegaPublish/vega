import webpackIntegration from '@lyra/webpack-integration/v3'

export default options => {
  return webpackIntegration.getPostcssPlugins(options)
}
