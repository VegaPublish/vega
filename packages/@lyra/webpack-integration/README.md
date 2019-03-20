# @lyra/webpack-integration

Tools and modules required for making partisan (the part system) work with webpack. Note: currently only works with Webpack 1.

## Installing

```
npm install --save @lyra/webpack-integration
```

## Usage

```js
const lyraWebpack = require('@lyra/webpack-integration/v1')
const options = {
  basePath: '/path/to/project',
  env: 'production'
}

// Get array of plugins required for part loading
lyraWebpack.getPlugins(options)

// Get array of loader definitions required for part loading
lyraWebpack.getLoaders(options)

// Get array of postcss plugins required to build the CSS used in Lyra
lyraWebpack.getPostcssPlugins(options)

// Get a partial webpack configuration for the Lyra-specific parts. You'll have to merge this with your existing webpack config.
lyraWebpack.getConfig(options)

// Less common, but if you need more fine-grained access to internals:

// Get a preconfigured `DefinePlugin` that exposes `__DEV__`
lyraWebpack.getEnvPlugin(options)

// Get the part resolver plugin required for part imports
lyraWebpack.getPartResolverPlugin(options)

// Get the part loader (requires the PartResolverPlugin)
lyraWebpack.getPartLoader(options)

// Get the resolving function required for postcss-import
lyraWebpack.getStyleResolver(options)

// Get an initialized postcss-import plugin
lyraWebpack.getPostcssImportPlugin(options)
```

## License

MIT-licensed. See LICENSE.
