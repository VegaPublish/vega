// @flow
import React from 'react'
import styles from './styles/CommunicatorWrapper.css'
import Communicator from '../providers/Communicator'

type Props = {
  children: any[],
  focusedCommentId: string
}

export default class CommunicatorWrapper extends React.Component<Props> {
  render() {
    const {children, ...rest} = this.props

    return (
      <div className={styles.root}>
        <div className={styles.content}>{children}</div>
        <div className={styles.communicator}>
          <Communicator {...rest} />
        </div>
      </div>
    )
  }
}
