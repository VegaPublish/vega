const React = require('react')
const PropTypes = require('prop-types')
const internals = require('@lyra/block-content-to-hyperscript/internals')
const {serializers, serializeSpan, renderProps} = require('./targets/dom')

const {getImageUrl, blocksToNodes, mergeSerializers} = internals
const renderNode = React.createElement

const LyraBlockContent = props => {
  const customSerializers = mergeSerializers(LyraBlockContent.defaultSerializers, props.serializers)

  const blockProps = Object.assign({}, renderProps, props, {
    serializers: customSerializers,
    blocks: props.blocks || []
  })

  return blocksToNodes(renderNode, blockProps, serializers, serializeSpan)
}

// Expose default serializers to the user
LyraBlockContent.defaultSerializers = serializers

// Expose logic for building image URLs from an image reference/node
LyraBlockContent.getImageUrl = getImageUrl

LyraBlockContent.propTypes = {
  className: PropTypes.string,
  renderContainerOnSingleChild: PropTypes.bool,

  // When rendering images, we need dataset, unless images are materialized
  dataset: PropTypes.string,
  imageOptions: PropTypes.object,

  serializers: PropTypes.shape({
    // Common overrides
    types: PropTypes.object,
    marks: PropTypes.object,

    // Less common overrides
    list: PropTypes.func,
    listItem: PropTypes.func,

    // Low-level serializers
    block: PropTypes.func,
    span: PropTypes.func
  }),

  blocks: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        _type: PropTypes.string.isRequired
      })
    ),
    PropTypes.shape({
      _type: PropTypes.string.isRequired
    })
  ]).isRequired
}

LyraBlockContent.defaultProps = {
  renderContainerOnSingleChild: false,
  serializers: {},
  imageOptions: {}
}

module.exports = LyraBlockContent
