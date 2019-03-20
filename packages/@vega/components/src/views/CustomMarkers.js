// @flow
import React from 'react'

import {Tooltip} from 'react-tippy'
import CommentIcon from 'part:@lyra/base/comment-icon'
import {IntentLink} from 'part:@vega/core/router'

import styles from './styles/CustomMarkers.css'

type marker = {}

type Props = {
  markers: marker[]
}

function commentExcerpt(blocks) {
  return blocks
    .filter(val => val._type === 'block')
    .map(block => {
      return block.children
        .filter(child => child._type === 'span')
        .map(span => span.text)
        .join('')
    })
    .join('')
    .substring(0, 50)
}

function reviewExcerpt(pointerWithComment) {
  const pointerKey = pointerWithComment.item.pointer._key
  const blockWithPointer = pointerWithComment.item.comment.content.find(blk =>
    blk.children.find(cld => cld._key === pointerKey)
  )
  return blockWithPointer.children
    .filter(child => child._type === 'span')
    .map(span => span.text)
    .join('')
    .substring(0, 50)
}

export default class CustomMarkers extends React.Component<Props> {
  static defaultProps = {
    markers: []
  }

  state = {
    pointerTooltipOpen: false
  }

  renderComment(comment) {
    return (
      <IntentLink
        className={styles.link}
        intent="edit"
        params={{
          id: comment.subject._id,
          comment: comment._id,
          type: comment.subject._type
        }}
      >
        {commentExcerpt(comment.body)}
        ...
      </IntentLink>
    )
  }

  renderReviewItem(pointerWithComment) {
    return <span>{reviewExcerpt(pointerWithComment)}</span>
  }

  renderPointersAndComments(pointers) {
    return (
      <ul className={styles.pointerList}>
        {pointers.map((pointerWithComment, index) => {
          const {comment} = pointerWithComment.item
          return (
            <li
              key={`${comment._id}-${index}`}
              onClick={this.handleClosePointerToolTip}
            >
              {comment._type === 'reviewItem' &&
                this.renderReviewItem(pointerWithComment)}
              {comment._type === 'comment' && this.renderComment(comment)}
            </li>
          )
        })}
      </ul>
    )
  }

  handlePointerTooltipClick = () => {
    this.setState({pointerTooltipOpen: true})
  }

  handleClosePointerToolTip = event => {
    this.setState({pointerTooltipOpen: false})
  }

  renderPointerTooltip(pointersAndComments) {
    const text = 'This item has comments, click to show'
    const {pointerTooltipOpen} = this.state
    return (
      <Tooltip
        title={text}
        trigger="manual"
        open={pointerTooltipOpen}
        useContext
        animation="scale"
        arrow
        theme="light"
        distance="2"
        duration={50}
        interactive
        onRequestClose={this.handleClosePointerToolTip}
        html={this.renderPointersAndComments(pointersAndComments)}
      >
        <a className={styles.link} onClick={this.handlePointerTooltipClick}>
          <CommentIcon />
        </a>
      </Tooltip>
    )
  }

  render() {
    const {markers} = this.props
    const pointers = markers.filter(mrkr => mrkr.type === 'pointer')
    if (pointers.length === 0) {
      return null
    }
    let highlightedPointerId = null
    const highlightedPointer = pointers.find(pnt => pnt.highlighted)
    if (highlightedPointer) {
      highlightedPointerId = highlightedPointer.item.pointer._key
    }
    return (
      <div id={highlightedPointerId} className={styles.root}>
        {this.renderPointerTooltip(pointers)}
      </div>
    )
  }
}

// eslint-disable-next-line react/no-multi-comp
export function renderCustomMarkers(markers) {
  return <CustomMarkers markers={markers} />
}
