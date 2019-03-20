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
  const {document, node} = props
  const {path} = node
  if (!document || !path) {
    return null
  }
  return (
    <IntentLink
      intent="edit"
      className={styles.link}
      params={{
        id: document._id,
        type: document._type,
        pointer: node._key,
        focusPath: encodeURIComponent(path.join(''))
      }}
    >
      ※
    </IntentLink>
  )
}
