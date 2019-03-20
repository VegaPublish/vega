import {startCase} from 'lodash'
import plur from 'plur'

const BUNDLED_DOC_TYPES = ['lyra.imageAsset', 'lyra.fileAsset']

function isDocumentType(type) {
  return type.type && type.type.name === 'document'
}

function isBundledDocType(typeName) {
  return BUNDLED_DOC_TYPES.includes(typeName)
}
export function getDocumentTypes(schema) {
  return schema
    .getTypeNames()
    .map(typeName => schema.get(typeName))
    .filter(type => !isBundledDocType(type.name) && isDocumentType(type))
}

export function getDisplayName(type) {
  return startCase(type.title || type.name)
}

export function getPluralDisplayName(type) {
  return plur(getDisplayName(type))
}
