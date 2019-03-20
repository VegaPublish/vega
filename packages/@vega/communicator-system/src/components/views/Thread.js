// @flow

import React from 'react'
import styles from './styles/Thread.css'
import ReplyPlaceholderInput from '../providers/ReplyPlaceholderInput'
import LazyComment from './LazyComment'

type PartialComment = {
  _id: string,
  threadId: string,
  subject: {_ref: string}
}
type ThreadT = {
  comments: PartialComment[]
}

type Props = {
  thread: ThreadT,
  focusedCommentId: string
}

export default class Thread extends React.PureComponent<Props> {
  render() {
    const {thread, focusedCommentId} = this.props
    const [head, ...replies] = thread.comments

    return (
      <div className={styles.root}>
        <LazyComment
          comment={head}
          key={head._id}
          isFocusedComment={head._id === focusedCommentId}
        />
        <div className={styles.responses}>
          {replies.map(comment => {
            return (
              <LazyComment
                comment={comment}
                key={comment._id}
                isFocusedComment={comment._id === focusedCommentId}
              />
            )
          })}
        </div>
        <ReplyPlaceholderInput
          subjectId={head.subject && head.subject._ref}
          threadId={head.threadId}
        />
      </div>
    )
  }
}
