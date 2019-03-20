// @flow
import React from 'react'
import styles from './styles/ThreadList.css'
import Thread from './Thread'

type ThreadT = {
  name: string,
  comments: any[]
}

type Props = {
  threads: ThreadT[],
  focusedCommentId: string
}

class ThreadList extends React.Component<Props> {
  render() {
    const {focusedCommentId, threads = []} = this.props

    return (
      <div className={styles.root}>
        {threads.map(thread => (
          <Thread
            key={thread.name}
            thread={thread}
            focusedCommentId={focusedCommentId}
          />
        ))}
      </div>
    )
  }
}

export default ThreadList
