// @flow
import React from 'react'

import CopyPath from '../CopyPath'

import styles from './styles/BlockActions.css'

export default function renderBockActions(block) {
  return (
    <div className={styles.root}>
      <CopyPath appendToPath={[{_key: block._key}]} />
    </div>
  )
}
