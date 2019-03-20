/* eslint-disable no-sync, no-console, id-length */
const fs = require('fs')
const readPackages = require('./readPackages')

const SET_VERSION = '0.0.0'

readPackages().forEach(pkg => {
  const nextManifest = {
    ...pkg.manifest,
    version: SET_VERSION
  }
  const stringified = `${JSON.stringify(nextManifest, null, 2)}\n`
  fs.writeFileSync(pkg.path, stringified)
})
