import fse from 'fs-extra'
import pathExists from 'path-exists'
import path from 'path'
import normalizePluginName from './normalizePluginName'

const baseChecksums = {
  '#':
    'Used by Lyra to keep track of configuration file checksums, do not delete or modify!'
}

export function setChecksum(lyraPath, pluginName, checksum) {
  return getChecksums(lyraPath).then(checksums => {
    checksums[pluginName] = checksum
    return fse.writeJson(getChecksumsPath(lyraPath), checksums, {spaces: 2})
  })
}

export function setChecksums(lyraPath, checksums) {
  const sums = Object.assign({}, baseChecksums, checksums)
  return fse.writeJson(getChecksumsPath(lyraPath), sums, {spaces: 2})
}

export function getChecksum(lyraPath, pluginName) {
  return getChecksums(lyraPath).then(sums => sums[pluginName])
}

export function getChecksums(lyraPath) {
  return fse.readJson(getChecksumsPath(lyraPath)).catch(() => baseChecksums)
}

export function getChecksumsPath(lyraPath) {
  return path.join(lyraPath, 'config', '.checksums')
}

export function hasSameChecksum(lyraPath, pluginName, checksum) {
  return getChecksum(lyraPath, pluginName).then(sum => sum === checksum)
}

export function localConfigExists(lyraPath, pluginName) {
  const name = normalizePluginName(pluginName)
  return pathExists(path.join(lyraPath, 'config', `${name}.json`))
}
