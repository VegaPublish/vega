// @flow
import type {Node} from 'react'
import ReactDOM from 'react-dom'
import Base64 from 'slate-base64-serializer'

import React from 'react'
import {Block} from 'slate'
import {Editor, findDOMNode, findNode, setEventTransfer} from 'slate-react'
import classNames from 'classnames'

import {IntentLink} from 'part:@lyra/base/router'
import BlockExtras from 'part:@lyra/form-builder/input/block-editor/block-extras'
import LinkIcon from 'part:@lyra/base/link-icon'
import ButtonsCollection from 'part:@lyra/components/buttons/button-collection'

import type {
  BlockContentFeatures,
  SlateValue,
  Type,
  SlateChange,
  Marker
} from '../typeDefs'

import {PatchEvent} from '../../../PatchEvent'
import {FOCUS_TERMINATOR} from '../../../utils/pathUtils'
import {resolveTypeName} from '../../../utils/resolveTypeName'

import createRange from '../utils/createRange'
import InvalidValue from '../../InvalidValueInput'
import Preview from '../../../Preview'
import DeleteButton from '../DeleteButton'
import EditButton from '../EditButton'
import ViewButton from '../ViewButton'

import styles from './styles/BlockObject.css'

type Props = {
  attributes: {},
  blockContentFeatures: BlockContentFeatures,
  children: Node,
  editor: Editor,
  editorValue: SlateValue,
  hasFormBuilderFocus: boolean,
  isSelected: boolean,
  markers: Marker[],
  node: Block,
  onChange: (change: SlateChange) => void,
  onFocus: (nextPath: []) => void,
  onHideBlockDragMarker: void => void,
  onPatch: (event: PatchEvent) => void,
  onShowBlockDragMarker: (pos: string, node: HTMLDivElement) => void,
  readOnly: ?boolean,
  blockActions?: React.Node,
  renderCustomMarkers?: (Marker[]) => React.Node,
  type: ?Type
}

type State = {
  isDragging: boolean,
  isEditing: boolean,
  isSelected: boolean
}

export default class BlockObject extends React.Component<Props, State> {
  rootElement: ?HTMLDivElement = null

  state = {
    isDragging: false
  }

  componentDidMount() {
    const {editor} = this.props
    this._editorNode = ReactDOM.findDOMNode(editor)
  }

  componentWillUnmount() {
    this.removeDragHandlers()
  }

  addDragHandlers() {
    const {readOnly} = this.props
    if (readOnly) {
      return
    }
    this._editorNode.addEventListener('dragover', this.handleDragOverOtherNode)
    this._editorNode.addEventListener('dragleave', this.handleDragLeave)
  }

  removeDragHandlers() {
    this._editorNode.removeEventListener(
      'dragover',
      this.handleDragOverOtherNode
    )
    this._editorNode.removeEventListener('dragleave', this.handleDragLeave)
  }

  handleDragStart = event => {
    const {node} = this.props
    this.setState({isDragging: true})
    this.addDragHandlers()
    // const element = ReactDOM.findDOMNode(this.previewContainer)
    const encoded = Base64.serializeNode(node, {preserveKeys: true})
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.dropEffect = 'none'
    setEventTransfer(event, 'node', encoded)
    // event.dataTransfer.setDragImage(element, element.clientWidth / 2, element.clientHeight)
  }

  // Remove the drop target if we leave the editors nodes
  handleDragLeave = event => {
    event.dataTransfer.dropEffect = 'none'
    this.props.onHideBlockDragMarker()
    if (event.target === this._editorNode) {
      this.resetDropTarget()
    }
  }

  resetDropTarget() {
    this._dropTarget = null
    this.props.onHideBlockDragMarker()
  }

  // eslint-disable-next-line complexity
  handleDragOverOtherNode = event => {
    const {node} = this.props
    if (!this.state.isDragging) {
      return
    }

    const targetDOMNode = event.target

    // As the event is registered on the editor parent node
    // ignore the event if it is coming from from the editor node itself
    if (targetDOMNode === this._editorNode) {
      return
    }

    const {editorValue} = this.props

    const targetNode = findNode(targetDOMNode, editorValue)
    if (!targetNode) {
      return
    }

    const block =
      targetNode.object === 'block'
        ? targetNode
        : editorValue.document.getClosestBlock(targetNode.key)

    // If no or same block reset and return
    if (!block || block.key === node.key) {
      event.dataTransfer.dropEffect = 'none'
      this.resetDropTarget()
      return
    }

    const range = createRange(event)

    if (range === null) {
      return
    }

    const {rangeIsAtStart, rangeOffset} = range

    // If the block in the nearest vincinity (same position target), reset and return
    let nearestNeighbour = false
    if (rangeIsAtStart) {
      const nextBlock = editorValue.document.getNextBlock(node.key)
      nearestNeighbour = nextBlock && nextBlock.key === block.key
    } else {
      const previousBlock = editorValue.document.getPreviousBlock(node.key)
      nearestNeighbour = previousBlock && previousBlock.key === block.key
    }
    if (nearestNeighbour) {
      event.dataTransfer.dropEffect = 'none'
      this.resetDropTarget()
      return
    }

    const domNode = findDOMNode(block) // eslint-disable-line react/no-find-dom-node

    if (rangeIsAtStart) {
      this.props.onShowBlockDragMarker('before', domNode)
    } else {
      this.props.onShowBlockDragMarker('after', domNode)
    }
    event.dataTransfer.dropEffect = 'move'
    this._dropTarget = {
      node: block,
      isAtStart: rangeIsAtStart,
      offset: rangeOffset
    }
  }

  handleDragEnd = event => {
    event.preventDefault()
    this.setState({isDragging: false})
    this.removeDragHandlers()
    const {onChange, node, editorValue} = this.props

    const target = this._dropTarget

    // Return if this is our node
    if (!target || target.node.key === node.key) {
      this.resetDropTarget()
      return
    }

    let nextChange = editorValue.change().removeNodeByKey(node.key)
    nextChange = nextChange[
      target.isAtStart ? 'collapseToStartOf' : 'collapseToEndOf'
    ](target.node)
      .insertBlock(node)
      .collapseToEndOf(node)
      .focus()

    onChange(nextChange)

    this.resetDropTarget()
  }

  handleCancelEvent = event => {
    event.preventDefault()
    event.stopPropagation()
  }

  handleFocus = event => {
    event.stopPropagation()
    const {node, onFocus} = this.props
    onFocus([{_key: node.key}, FOCUS_TERMINATOR])
  }

  handleEditStart = event => {
    event.stopPropagation()
    const {node, onFocus, onChange, editorValue} = this.props
    const change = editorValue
      .change()
      .collapseToEndOf(node)
      .focus()
      .blur()
    onChange(change, () => onFocus([{_key: node.key}, FOCUS_TERMINATOR]))
  }

  handleClose = () => {
    const {node, onFocus} = this.props
    onFocus([{_key: node.key}])
  }

  refFormBuilderBlock = formBuilderBlock => {
    this.formBuilderBlock = formBuilderBlock
  }

  refPreview = previewContainer => {
    this.previewContainer = previewContainer
  }

  getValue() {
    return this.props.node.data.get('value')
  }

  handleInvalidValue = (event: PatchEvent) => {
    const {onPatch} = this.props
    const value = this.getValue()
    onPatch(event.prefixAll({_key: value._key}), value)
  }

  handleRemoveValue = event => {
    event.preventDefault()
    event.stopPropagation()
    const {editorValue, node, onChange} = this.props
    const change = editorValue.change()
    onChange(change.removeNodeByKey(node.key).focus())
  }

  renderPreview(value) {
    const {type, readOnly} = this.props
    return (
      <div>
        <div className={styles.header}>
          <div className={styles.type}>
            {type.title || type.name || 'Unknown'}
          </div>
          <ButtonsCollection align="end" className={styles.functions}>
            {value._ref && (
              <IntentLink
                className={styles.linkToReference}
                intent="edit"
                params={{id: value._ref}}
              >
                <LinkIcon />
              </IntentLink>
            )}
            {readOnly ? (
              <div>
                <ViewButton
                  title="View this block"
                  onClick={this.handleFocus}
                />
              </div>
            ) : (
              <div>
                <EditButton
                  title="Edit this block"
                  onClick={this.handleEditStart}
                />
              </div>
            )}
            {!readOnly && (
              <div>
                <DeleteButton
                  title="Remove this block"
                  onClick={this.handleRemoveValue}
                />
              </div>
            )}
          </ButtonsCollection>
        </div>
        <Preview type={type} value={value} layout="block" />
      </div>
    )
  }

  render() {
    const {
      attributes,
      blockContentFeatures,
      editorValue,
      isSelected,
      markers,
      node,
      onChange,
      onFocus,
      readOnly,
      blockActions,
      renderCustomMarkers
    } = this.props
    const value = this.getValue()
    const valueType = resolveTypeName(value)
    const validTypes = blockContentFeatures.types.blockObjects
      .map(objType => objType.name)
      .concat('block')

    if (!validTypes.includes(valueType)) {
      return (
        <div onClick={this.handleCancelEvent}>
          <InvalidValue
            validTypes={validTypes}
            actualType={valueType}
            value={value}
            onChange={this.handleInvalidValue}
          />
        </div>
      )
    }
    const validation = markers.filter(marker => marker.type === 'validation')
    const errors = validation.filter(marker => marker.level === 'error')

    const highlightedMarker = markers.find(mrk => mrk.highlighted)
    const highlightedId = highlightedMarker
      ? highlightedMarker.highlighted
      : null

    const classname = classNames([
      styles.root,
      editorValue.selection.hasFocusIn(node) && styles.focused,
      isSelected && styles.selected,
      errors.length > 0 && styles.hasErrors
    ])

    return (
      <div>
        <div
          {...attributes}
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
          onDragEnter={this.handleCancelEvent}
          onDragLeave={this.handleCancelEvent}
          onDrop={this.handleCancelEvent}
          onDoubleClick={this.handleEditStart}
          draggable={!readOnly}
          ref={this.refFormBuilderBlock}
          className={classname}
        >
          <div ref={this.refPreview} className={styles.previewContainer}>
            {this.renderPreview(value)}
          </div>
        </div>
        {(markers.length > 0 || blockActions) && (
          <BlockExtras
            highlightedMarkerId={highlightedId}
            markers={markers}
            onFocus={onFocus}
            onChange={onChange}
            editorValue={editorValue}
            block={value}
            blockActions={blockActions}
            renderCustomMarkers={renderCustomMarkers}
          />
        )}
      </div>
    )
  }
}
