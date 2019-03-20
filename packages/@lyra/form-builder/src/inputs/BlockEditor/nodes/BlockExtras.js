// @flow
import type {Marker, SlateChange, SlateValue} from '../typeDefs'
import React from 'react'
import classNames from 'classnames'

import Markers from 'part:@lyra/form-builder/input/block-editor/block-markers'

import styles from './styles/BlockExtras.css'

type marker = {}

type Props = {
  editorValue: SlateValue,
  markers: marker[],
  onChange: (change: SlateChange) => void,
  onFocus: void => void,
  blockActions?: React.Node,
  renderCustomMarkers?: (Marker[]) => React.Node,
  highlightedMarkerId: ?string
}

export default class BlockExtras extends React.PureComponent<Props> {
  static defaultProps = {
    markers: []
  }

  getValidationMarkers() {
    const {markers} = this.props
    const validation = markers.filter(mrkr => mrkr.type === 'validation')
    return validation.map(mrkr => {
      if (mrkr.path.length <= 1) {
        return mrkr
      }
      const level = mrkr.level === 'error' ? 'errors' : 'warnings'
      return Object.assign({}, mrkr, {
        item: mrkr.item.cloneWithMessage(`Contains ${level}`)
      })
    })
  }

  render() {
    const {
      markers,
      onFocus,
      onChange,
      editorValue,
      blockActions,
      renderCustomMarkers,
      highlightedMarkerId
    } = this.props
    const scopedValidation = this.getValidationMarkers()
    const errors = scopedValidation.filter(mrkr => mrkr.level === 'error')
    const warnings = scopedValidation.filter(mrkr => mrkr.level === 'warning')
    return (
      <div
        id={highlightedMarkerId ? highlightedMarkerId : null}
        className={classNames([
          styles.root,
          (blockActions || markers.length > 0) && styles.withSomething,
          errors.length > 0 && styles.withError,
          warnings.length > 0 && !errors.length && styles.withWarning,
          highlightedMarkerId && styles.withMarkerHighlight
        ])}
        suppressContentEditableWarning
        contentEditable="false"
      >
        {blockActions && (
          <div className={styles.blockActions}>{blockActions}</div>
        )}
        {markers.length > 0 && (
          <div className={styles.markers}>
            <Markers
              className={styles.markers}
              markers={markers}
              scopedValidation={scopedValidation}
              onFocus={onFocus}
              onChange={onChange}
              editorValue={editorValue}
              renderCustomMarkers={renderCustomMarkers}
            />
          </div>
        )}
      </div>
    )
  }
}
