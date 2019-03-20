import React from 'react'
import PropTypes from 'prop-types'
import {Tooltip} from 'react-tippy'
import styles from './PointerPreview.css'
import client from 'part:@lyra/base/client'

export default class PointerPreview extends React.Component {
  handleClick = evt => {
    evt.preventDefault()
    evt.stopPropagation()
  }
  render() {
    let title = `Pointer to place in text`
    const {value} = this.props
    if (value && value.returnValue) {
      title += ` (${value.returnValue.path})`
    }
    return (
      <span className={styles.pointerInline} onClick={this.handleClick}>
        <Tooltip
          title={title}
          arrow
          theme="light"
          distance="2"
          sticky
          size="small"
        >
          ※
        </Tooltip>
      </span>
    )
  }
}
