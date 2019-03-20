/* eslint-disable no-sync */
const readPackages = require('./readPackages')
const writePkg = require('write-pkg')

module.exports = function transformPkgs(mapFn) {
  readPackages().forEach(pkg => {
    const transformedManifest = mapFn(pkg.manifest)
    writePkg(pkg.path, transformedManifest)
  })
}
