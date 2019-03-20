// @flow

import React from 'react'
import {IntentLink} from 'part:@vega/core/router'
import styles from './styles/Pointer.css'
type Props = {
  document: {
    _id: string,
    _type: string
  },
  node: {
    path: Array<string>
  }
}

export default function Pointer(props: Props) {
  const {node} = props
  const {document, path} = node

  if (!document || !path) {
    return null
  }
  const reviewProcessId = /reviewProcess=(.*?);/g.exec(window.location.href)[1]
  return (
    <IntentLink
      intent="showPointer"
      className={styles.link}
      params={{
        pointer: node._key,
        id: reviewProcessId
      }}
    >
      ※
    </IntentLink>
  )
}
