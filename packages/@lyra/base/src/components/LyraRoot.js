import React from 'react'
import RootComponent from 'part:@lyra/base/root'
import VersionChecker from './VersionChecker'
import styles from './styles/LyraRoot.css'

function LyraRoot() {
  return (
    <div className={styles.root}>
      <RootComponent />
      <VersionChecker />
    </div>
  )
}

export default LyraRoot
