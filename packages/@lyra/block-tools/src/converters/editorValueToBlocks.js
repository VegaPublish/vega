// @flow

import {get, flatten, uniq, uniqBy} from 'lodash'
import randomKey from '../util/randomKey'
import normalizeBlock from '../util/normalizeBlock'
import {BLOCK_DEFAULT_STYLE} from '../constants'
import blockContentTypeToOptions from '../util/blockContentTypeToOptions'

function createCustomBlockFromData(block) {
  const {value} = block.data
  if (!value) {
    throw new Error(`Data got no value: ${JSON.stringify(block.data)}`)
  }
  const finalBlock = {...value}
  finalBlock._key = block.data._key || randomKey(12)
  if (!finalBlock._type) {
    throw new Error(`The block must have a _type: ${JSON.stringify(value)}`)
  }
  return finalBlock
}

function toLyraSpan(
  node,
  lyraBlock,
  spanIndex,
  blockContentFeatures,
  options = {}
) {
  const allowedDecorators = blockContentFeatures.decorators.map(
    decorator => decorator.value
  )
  if (node.object === 'text') {
    return node.leaves.map(leaf => {
      return {
        _type: 'span',
        _key: `${lyraBlock._key}${spanIndex()}`,
        text: leaf.text,
        marks: uniq(
          leaf.marks
            .map(mark => mark.type)
            .filter(markType => allowedDecorators.includes(markType))
        )
      }
    })
  }
  if (node.object === 'inline') {
    const {nodes, data} = node
    const annotations = data.annotations
    const annotationKeys = []
    if (annotations) {
      Object.keys(annotations).forEach(name => {
        const annotation = annotations[name]
        const annotationKey = annotation._key
        if (annotation && annotationKey) {
          lyraBlock.markDefs.push(annotation)
          annotationKeys.push(annotationKey)
        }
      })
    }
    return flatten(
      nodes.map(nodesNode => {
        if (nodesNode.object !== 'text') {
          throw new Error(
            `Unexpected non-text child node for inline text: ${
              nodesNode.object
            }`
          )
        }
        if (node.type !== 'span') {
          return node.data.value
        }
        return nodesNode.leaves.map(leaf => ({
          _type: 'span',
          _key: `${lyraBlock._key}${spanIndex()}`,
          text: leaf.text,
          marks: uniq(
            leaf.marks
              .map(mark => mark.type)
              .filter(markType => allowedDecorators.includes(markType))
              .concat(annotationKeys)
          )
        }))
      })
    )
  }
  throw new Error(`Unsupported object ${node.object}`)
}

function toLyraBlock(block, blockContentFeatures, options = {}) {
  if (block.type === 'contentBlock') {
    const lyraBlock = {
      ...block.data,
      _type: 'block',
      markDefs: []
    }
    let index = 0
    const spanIndex = () => {
      return index++
    }
    if (!lyraBlock._key) {
      lyraBlock._key = lyraBlock.key || randomKey(12)
    }
    if (!lyraBlock.style) {
      lyraBlock.style = BLOCK_DEFAULT_STYLE
    }
    lyraBlock.children = flatten(
      block.nodes.map(node =>
        toLyraSpan(node, lyraBlock, spanIndex, blockContentFeatures, options)
      )
    )
    lyraBlock.markDefs = uniqBy(lyraBlock.markDefs, def => def._key)
    return options.normalize ? normalizeBlock(lyraBlock) : lyraBlock
  }
  if (
    blockContentFeatures.types.blockObjects
      .map(bObj => bObj.name)
      .includes(block.type)
  ) {
    return createCustomBlockFromData(block)
  }
  // A block that is not in the schema, so we don't know what to do with it,
  // Return an empty block with just key and type
  return {
    _type: block.type,
    _key: randomKey(12)
  }
}

export default function editorValueToBlocks(
  value: {},
  type: any,
  options = {}
) {
  const blockContentFeatures = blockContentTypeToOptions(type)
  const nodes = get(value, 'document.nodes')
  if (!nodes || nodes.length === 0) {
    return []
  }
  return nodes
    .map(node => toLyraBlock(node, blockContentFeatures, options))
    .filter(Boolean)
}
