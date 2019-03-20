// @flow
import React from 'react'
import {withPropsStream} from 'react-props-stream'
import {map} from 'rxjs/operators'

import styles from './styles/Communicator.css'
import ThreadList from './ThreadList'
import CreateComment from './CreateComment'

function getPropsStream(props$) {
  // todo: implement open/close behavior
  return props$.pipe(map(props => ({...props, isOpen: true})))
}

type Props = {
  isOpen: boolean,
  subjectIds: string[],
  focusedCommentId: string
}

export default withPropsStream(
  getPropsStream,
  class Communicator extends React.Component<Props> {
    state = {
      createCommentIsSticky: false
    }

    handleCloseCreateComment = event => {
      this.setState({
        createCommentIsSticky: false
      })
      event.stopPropagation()
    }

    handleStickCreateComment = () => {
      this.setState({
        createCommentIsSticky: true
      })
    }

    render() {
      const {isOpen, subjectIds, focusedCommentId} = this.props
      const {createCommentIsSticky} = this.state
      return isOpen ? (
        <div className={styles.root}>
          <div
            className={
              createCommentIsSticky
                ? styles.feedWithWithStickyCreateComment
                : styles.feed
            }
          >
            <ThreadList
              subjectId={subjectIds}
              focusedCommentId={focusedCommentId}
            />
          </div>
          {subjectIds.length === 1 && (
            <CreateComment
              subjectId={subjectIds[0]}
              showCloseButton={createCommentIsSticky}
              className={
                createCommentIsSticky
                  ? styles.createCommentSticky
                  : styles.createComment
              }
              onClose={this.handleCloseCreateComment}
              onSubmit={this.handleCloseCreateComment}
              onClick={this.handleStickCreateComment}
            />
          )}
        </div>
      ) : null
    }
  }
)
