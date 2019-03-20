const uniq = require('lodash/uniq')
const transformPkgs = require('./transformPkgs')

const COMMON_KEYWORDS = [
  'vega',
  'vegapublish',
  'realtime',
  'content',
  'open access publishing'
]
const supportedNodeVersionRange = '>=6.0.0'

transformPkgs(pkgManifest => {
  const name = pkgManifest.name.split('/').slice(-1)[0]

  const engines = pkgManifest.engines
  if (engines && engines.node) {
    engines.node = supportedNodeVersionRange
  }

  return {
    ...pkgManifest,
    engines,
    author: 'Vega <hello@vegapublish.com>',
    bugs: {
      url: 'https://github.com/VegaPublish/vega/issues'
    },
    keywords: uniq(
      COMMON_KEYWORDS.concat(name).concat(pkgManifest.keywords || [])
    ),
    homepage: 'http://vegapublish.com/',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'git+https://github.com/VegaPublish/vega.git'
    },
    ...(pkgManifest.private
      ? {}
      : {
          publishConfig: {
            access: 'public'
          }
        })
  }
})
