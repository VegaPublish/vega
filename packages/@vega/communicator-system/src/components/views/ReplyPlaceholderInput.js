// @flow

import React from 'react'
import styles from './styles/ReplyPlaceholderInput.css'
import {getProfileImageUrl} from 'part:@vega/datastores/user'
import CreateComment from '../providers/CreateComment'

type Props = {
  author: {
    _id: string
  },
  onFocus: () => {},
  onClose: () => {},
  isFocused: boolean,
  threadId: string,
  subjectId: string
}

export default class ReplyPlaceholderInput extends React.PureComponent<Props> {
  render() {
    const {
      author,
      onFocus,
      onClose,
      isFocused,
      threadId,
      subjectId
    } = this.props
    const imageUrl = getProfileImageUrl(author)

    return (
      <div className={styles.root}>
        {isFocused ? (
          <div className={styles.createComment}>
            <CreateComment
              subjectId={subjectId}
              threadId={threadId}
              onClose={onClose}
            />
          </div>
        ) : (
          <div onClick={onFocus} className={styles.replyButton}>
            <img src={imageUrl} className={styles.image} />
            <span className={styles.text}>Reply…</span>
          </div>
        )}
      </div>
    )
  }
}
