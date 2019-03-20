/* eslint-disable no-sync, no-process-env */
import fse from 'fs-extra'
import path from 'path'
import generateHelpUrl from '@lyra/generate-help-url'
import {reduceConfig} from '@lyra/util'
import validateManifest from './validateManifest'

function readManifestSync(manifestPath, options) {
  try {
    return parseManifest(fse.readFileSync(manifestPath), options)
  } catch (err) {
    return handleManifestReadError(err, options)
  }
}

function handleManifestReadError(err, options) {
  if (err.code === 'ENOENT' && options.plugin) {
    const base = `No "lyra.json" file found in plugin "${options.plugin}"`
    const help = `See ${generateHelpUrl('missing-plugin-lyra-json')}`
    throw new Error(`${base}\n${help}`)
  } else if (err.name === 'ValidationError' && options.plugin) {
    err.message = `Error while reading "${options.plugin}" manifest:\n${
      err.message
    }`
  } else if (err.name === 'ValidationError') {
    err.message = `Error while reading "${options.basePath}/lyra.json":\n${
      err.message
    }`
  }

  throw err
}

function parseManifest(rawData, options) {
  const parsedManifest = JSON.parse(rawData)
  const manifest = validateManifest(parsedManifest)
  const reduced = reduceConfig(manifest, options.env)
  return reduced
}

function readManifest(opts = {}) {
  const env = process.env.NODE_ENV || 'development'
  const options = Object.assign({env}, opts)
  const basePath = options.basePath || process.cwd()
  const manifestPath = path.join(options.manifestDir || basePath, 'lyra.json')

  if (options.sync) {
    return readManifestSync(manifestPath, options)
  }

  return fse
    .readFile(manifestPath, {encoding: 'utf8'})
    .then(raw => parseManifest(raw, options))
    .catch(err => handleManifestReadError(err, options))
}

export default readManifest
