const qs = require('querystring')
const path = require('path')
const partResolver = require('@lyra/resolver')
const emptyPart = require.resolve('./emptyPart')
const debugPart = require.resolve('./debugPart')
const unimplementedPart = require.resolve('./unimplementedPart')
const partMatcher = /^(all:)?part:[@A-Za-z0-9_-]+\/[A-Za-z0-9_/-]+/
const configMatcher = /^config:(@?[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+|[A-Za-z0-9_-]+)$/
const lyraMatcher = /^lyra:/
const target = 'resolve'

const isLyraPart = request =>
  [partMatcher, configMatcher, lyraMatcher].some(match =>
    match.test(request.request)
  )

const PartResolverPlugin = function(options) {
  if (!options || !options.basePath) {
    throw new Error(
      '`basePath` option must be specified in part resolver plugin constructor'
    )
  }

  this.environment = options.env
  this.basePath = options.basePath
  this.additionalPlugins = options.additionalPlugins || []
  this.configPath = path.join(this.basePath, 'config')
}

PartResolverPlugin.prototype.apply = function(compiler) {
  const env = this.environment
  const basePath = this.basePath
  const additionalPlugins = this.additionalPlugins
  const configPath = this.configPath

  compiler.plugin('watch-run', (watcher, cb) =>
    cacheParts(watcher)
      .then(cb)
      .catch(cb)
  )
  compiler.plugin('run', (params, cb) =>
    cacheParts(params)
      .then(cb)
      .catch(cb)
  )

  function cacheParts(params) {
    const instance = params.compiler || params
    instance.lyra = compiler.lyra || {basePath: basePath}
    return partResolver
      .resolveParts({env, basePath, additionalPlugins})
      .then(parts => {
        instance.lyra.parts = parts
      })
  }

  compiler.plugin('compilation', () => {
    compiler.resolvers.normal.plugin('module', function(request, callback) {
      // If it doesn't match the string pattern of a Lyra part, stop trying to resolve it
      if (!isLyraPart(request)) {
        return callback()
      }

      const parts = compiler.lyra.parts
      const lyraPart = request.request.replace(/^all:/, '')

      // The debug part should return the whole part/plugin tree
      if (request.request === 'lyra:debug') {
        return this.doResolve(
          target,
          getResolveOptions({
            resolveTo: debugPart,
            request: request
          }),
          null,
          callback
        )
      }

      // The versions part should return a list of module versions
      if (request.request === 'lyra:versions') {
        return this.doResolve(
          target,
          getResolveOptions({
            resolveTo: debugPart,
            request: request
          }),
          null,
          callback
        )
      }

      // Configuration files resolve to a specific path
      // Either the root lyra.json or a plugins JSON config
      const configMatch = request.request.match(configMatcher)
      if (configMatch) {
        const configFor = configMatch[1]
        const req = Object.assign({}, request, {
          request:
            configFor === 'lyra'
              ? path.join(basePath, 'lyra.json')
              : path.join(configPath, `${configFor}.json`)
        })

        req.query = `?${qs.stringify({lyraPart: request.request})}`
        return this.doResolve(target, req, null, callback)
      }

      const loadAll = request.request.indexOf('all:') === 0
      const allowUnimplemented = request.query === '?'
      const part = parts.implementations[lyraPart]

      // Imports throw if they are not implemented, except if they
      // are prefixed with `all:` (returns an empty array) or they
      // are postfixed with `?` (returns undefined)
      if (!part) {
        if (allowUnimplemented) {
          return this.doResolve(
            target,
            {request: unimplementedPart, path: unimplementedPart},
            null,
            callback
          )
        }

        if (loadAll) {
          return this.doResolve(
            target,
            {request: emptyPart, path: emptyPart},
            null,
            callback
          )
        }

        return callback(
          new Error(`Part "${lyraPart}" not implemented by any plugins`)
        )
      }

      const resolveOpts = getResolveOptions({
        resolveTo: part[0].path,
        request: request
      })

      return this.doResolve(target, resolveOpts, null, callback)
    })
  })
}

function getResolveOptions(options) {
  const reqQuery = (options.request.query || '').replace(/^\?/, '')
  const query = Object.assign({}, qs.parse(reqQuery) || {}, {
    lyraPart: options.request.request
  })

  return Object.assign({}, options.request, {
    request: options.resolveTo,
    query: `?${qs.stringify(query)}`
  })
}

module.exports = PartResolverPlugin
