// @flow

import {uniq} from 'lodash'
import randomKey from '../util/randomKey'
import resolveJsType from '../util/resolveJsType'
import blockContentTypeToOptions from '../util/blockContentTypeToOptions'
import normalizeBlock from '../util/normalizeBlock'

function resolveTypeName(value) {
  const jsType = resolveJsType(value)
  return (jsType === 'object' && '_type' in value && value._type) || jsType
}

function hasKeys(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return true
    }
  }
  return false
}

function toRawMark(markName) {
  return {
    object: 'mark',
    type: markName
  }
}

function lyraSpanToRawSlateBlockNode(
  span,
  lyraBlock,
  blockContentFeatures,
  childIndex
) {
  // Inline object
  if (span._type !== 'span') {
    const spanKey = `${lyraBlock._key}${childIndex()}`
    span._key = spanKey
    return {
      object: 'inline',
      isVoid: true,
      key: spanKey,
      type: span._type,
      data: {value: span, _key: spanKey},
      nodes: [
        {
          object: 'text',
          leaves: [
            {
              object: 'leaf',
              text: '',
              marks: []
            }
          ]
        }
      ]
    }
  }

  const {text, marks = []} = span
  const schemaDecorators = blockContentFeatures.decorators.map(
    decorator => decorator.value
  )
  const decorators = marks.filter(mark => schemaDecorators.includes(mark))
  const annotationKeys = marks.filter(
    mark =>
      decorators.indexOf(mark) === -1 &&
      lyraBlock.markDefs.map(def => def._key).includes(mark)
  )
  let annotations
  if (annotationKeys.length) {
    annotations = {}
    annotationKeys.forEach(key => {
      const annotation = lyraBlock.markDefs.find(def => def._key === key)
      if (annotations && annotation) {
        annotations[annotation._type] = annotation
      }
    })
  }
  const leaf = {
    object: 'leaf',
    text: text,
    marks: uniq(decorators.concat(annotationKeys).filter(Boolean)).map(
      toRawMark
    )
  }
  if (!annotations) {
    return {
      object: 'text',
      leaves: [leaf],
      key: `${lyraBlock._key}${childIndex()}`
    }
  }

  const spanKey = `${lyraBlock._key}${childIndex()}`

  return {
    object: 'inline',
    isVoid: false,
    type: 'span',
    key: spanKey,
    data: {_key: spanKey, annotations: annotations},
    nodes: [{object: 'text', leaves: [leaf]}]
  }
}

// Block type object
function lyraBlockToRawNode(lyraBlock, blockContentFeatures, options = {}) {
  const {children, _type, markDefs, ...rest} = lyraBlock
  let restData = {}
  if (hasKeys(rest)) {
    restData = {data: {_type, ...rest}}
    // Check if we should allow listItem if present
    const {listItem} = restData.data
    if (
      listItem &&
      !blockContentFeatures.lists.find(list => list.value === listItem)
    ) {
      delete restData.data.listItem
    }
    // Check if we should allow style if present
    const {style} = restData.data
    if (
      style &&
      !blockContentFeatures.styles.find(_style => _style.value === style)
    ) {
      restData.data.style = 'normal'
    }
  }

  if (!lyraBlock._key) {
    lyraBlock._key = randomKey(12)
  }

  let index = 0
  const childIndex = () => {
    return index++
  }

  const block = {
    object: 'block',
    key: lyraBlock._key,
    isVoid: false,
    type: 'contentBlock',
    ...restData,
    nodes: children.map(child =>
      lyraSpanToRawSlateBlockNode(
        child,
        lyraBlock,
        blockContentFeatures,
        childIndex
      )
    )
  }
  if (options.normalize) {
    return normalizeBlock(block)
  }
  return block
}

// Embedded object
function lyraBlockItemToRaw(blockItem) {
  if (!blockItem._key) {
    blockItem._key = randomKey(12)
  }
  return {
    object: 'block',
    key: blockItem._key,
    type: blockItem._type,
    isVoid: true,
    data: {value: blockItem, _key: blockItem._key},
    nodes: [
      {
        object: 'text',
        leaves: [
          {
            object: 'leaf',
            text: '',
            marks: []
          }
        ]
      }
    ]
  }
}

function lyraBlockItemToRawNode(
  blockItem,
  type,
  blockContentFeatures,
  options
) {
  const blockItemType = resolveTypeName(blockItem)

  return blockItemType === 'block'
    ? lyraBlockToRawNode(blockItem, blockContentFeatures, options)
    : lyraBlockItemToRaw(blockItem)
}

function lyraBlocksArrayToRawNodes(
  blockArray,
  type,
  blockContentFeatures,
  options = {}
) {
  return blockArray.map(item =>
    lyraBlockItemToRawNode(item, type, blockContentFeatures, options)
  )
}

export default function blocksToEditorValue(
  array: [],
  type: any,
  options = {}
) {
  const blockContentFeatures = blockContentTypeToOptions(type)
  return {
    object: 'value',
    data: {},
    document: {
      key: randomKey(12),
      object: 'document',
      data: {},
      nodes:
        array && array.length > 0
          ? lyraBlocksArrayToRawNodes(
              array,
              type,
              blockContentFeatures,
              options
            )
          : []
    }
  }
}
