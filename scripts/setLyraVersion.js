/* eslint-disable no-sync, no-console, id-length */
const fs = require('fs')
const readPackages = require('./readPackages')

const SET_VERSION = '0.0.0'

const isLyraDep = depName => depName.split('/')[0].startsWith('@lyra')
const shouldSkip = depName => !isLyraDep(depName)

const upgrade = deps => {
  if (!deps) {
    return deps
  }
  return Object.keys(deps).reduce(
    (upgraded, depName) => {
      if (shouldSkip(depName)) {
        return upgraded
      }
      upgraded[depName] = SET_VERSION
      return upgraded
    },
    {...deps}
  )
}

readPackages().forEach(pkg => {
  console.log(pkg.manifest.name)
  const nextManifest = {
    ...pkg.manifest,
    dependencies: upgrade(pkg.manifest.dependencies),
    devDependencies: upgrade(pkg.manifest.devDependencies)
  }
  const stringified = `${JSON.stringify(nextManifest, null, 2)}\n`
  fs.writeFileSync(pkg.path, stringified)
})
