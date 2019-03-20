const path = require('path')
const loaderUtils = require('loader-utils')
const lyraUtil = require('@lyra/util')
const multiImplementationHandler = require('./multiImplementationHandler')
const reduceConfig = lyraUtil.reduceConfig
const getLyraVersions = lyraUtil.getLyraVersions

/* eslint-disable no-process-env */
const lyraEnv = process.env.LYRA_ENV
const env = typeof lyraEnv === 'undefined' ? process.env.NODE_ENV : lyraEnv
/* eslint-enable no-process-env */

function lyraPartLoader(input) {
  this.cacheable()

  let buildEnv = lyraEnv
  if (!buildEnv) {
    buildEnv = this.options.devtool ? env : 'production'
  }

  const qs = this.resourceQuery.substring(this.resourceQuery.indexOf('?'))
  const request = (loaderUtils.parseQuery(qs) || {}).lyraPart

  const loadAll = request.indexOf('all:') === 0
  const partName = loadAll ? request.substr(4) : request

  // In certain cases (CSS when building statically),
  // a separate compiler instance is triggered
  if (!this._compiler.lyra) {
    return input
  }

  const basePath = this._compiler.lyra.basePath

  if (request.indexOf('config:') === 0) {
    const config = JSON.parse(input)
    const indent = buildEnv === 'production' ? 0 : 2
    const reduced = reduceConfig(config, buildEnv)
    return `module.exports = ${JSON.stringify(reduced, null, indent)}\n`
  }

  if (request === 'lyra:versions') {
    const versions = getLyraVersions(basePath)
    const indent = buildEnv === 'production' ? 0 : 2
    return `module.exports = ${JSON.stringify(versions, null, indent)}\n`
  }

  const parts = this._compiler.lyra.parts
  const dependencies = parts.plugins.map(plugin =>
    path.join(plugin.path, 'lyra.json')
  )
  const implementations = (parts.implementations[partName] || []).map(
    impl => impl.path
  )

  this.addDependency(path.join(basePath, 'lyra.json'))
  dependencies.forEach(this.addDependency)

  // The debug role needs to return the whole parts tree
  if (partName === 'lyra:debug') {
    const debug = Object.assign({}, parts, {basePath})
    return `module.exports = ${JSON.stringify(debug, null, 2)}\n`
  }

  return loadAll ? multiImplementationHandler(partName, implementations) : input
}

module.exports = lyraPartLoader
