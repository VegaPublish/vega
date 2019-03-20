// @flow

import React from 'react'
import styles from './styles/Comment.css'
import lyraClient from 'part:@lyra/base/client'
import BlockContent from '@lyra/block-content-to-react'
import EditComment from '../providers/EditComment'
import Byline from '../providers/Byline'
import Pointer from '../providers/Pointer'

type Props = {
  comment: {
    _id: string,
    author: {
      _id: string
    },
    _updatedAt: string,
    body?: Array<any>,
    subject: {
      _ref: string
    }
  },
  isFocusedComment: boolean
}

const serializers = {
  types: {
    pointer: Pointer
  }
}
export default class Comment extends React.Component<Props, *> {
  state = {isEditing: false}

  _commentElement: any

  componentDidMount() {
    this.scrollIntoView()
  }

  componentDidUpdate(nextProps: Props) {
    const {isFocusedComment} = this.props
    if (isFocusedComment && nextProps.isFocusedComment !== isFocusedComment) {
      this.scrollIntoView()
    }
  }

  scrollIntoView = () => {
    const {isFocusedComment} = this.props
    if (this._commentElement && isFocusedComment) {
      // Wait for things to get finshed rendered before scrolling there
      setTimeout(
        () =>
          window.requestAnimationFrame(() => {
            this._commentElement.scrollIntoView({behavior: 'smooth'})
          }),
        500
      )
    }
  }

  handleEdit = () => {
    this.setState({isEditing: true})
  }

  handleDelete = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Delete this comment?')) {
      const {comment} = this.props
      lyraClient.delete(comment._id)
    }
  }

  handleEditEnd = () => {
    this.setState({isEditing: false})
  }

  setCommentElement = element => {
    this._commentElement = element
  }

  render() {
    const {comment, isFocusedComment} = this.props
    const {isEditing} = this.state
    const classNames = [styles.root, isFocusedComment && styles.focused].filter(
      Boolean
    )
    return (
      <div
        ref={this.setCommentElement}
        className={classNames.join(' ')}
        data-anchor={comment._id}
      >
        {isEditing && (
          <EditComment comment={comment} onEditEnd={this.handleEditEnd} />
        )}
        {!isEditing && (
          <div className={styles.body}>
            <Byline author={comment.author} time={comment._updatedAt} />
            <div className={styles.blockContent}>
              <BlockContent
                blocks={comment.body}
                serializers={serializers}
                className={styles.blockContent}
              />
            </div>
            <div className={styles.functions}>
              <a className={styles.edit} onClick={this.handleEdit}>
                Edit
              </a>
              <a className={styles.delete} onClick={this.handleDelete}>
                Delete
              </a>
            </div>
          </div>
        )}
      </div>
    )
  }
}
