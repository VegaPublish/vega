//@flow
import React from 'react'

import schema from 'part:@lyra/base/schema'
import EditDocumentField from '@vega/components/EditDocumentField'

const commentType = schema.get('comment')

type Props = {
  comment: {
    _id: string,
    body: Array<*>
  },
  onChange: Function,
  patchChannel: Object
}

export default function CommentBodyInput(props: Props) {
  const {comment, onChange, patchChannel} = props
  return (
    <EditDocumentField
      key={comment._id}
      fieldName="body"
      type={commentType}
      value={comment}
      onChange={onChange}
      patchChannel={patchChannel}
      hideLabel
    />
  )
}
