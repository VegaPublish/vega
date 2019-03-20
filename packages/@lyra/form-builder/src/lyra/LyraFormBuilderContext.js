// @flow
// Default wiring for FormBuilderContext when used as a lyra part
import React from 'react'
import FormBuilderContext from '../FormBuilderContext'
import LyraPreview from 'part:@lyra/base/preview'
import inputResolver from './inputResolver/inputResolver'
import type {Node} from 'react'

const previewResolver = () => LyraPreview

type Props = {
  value: ?any,
  schema: Object,
  patchChannel: any,
  children: Node
}

export default function LyraFormBuilderContext(props: Props) {
  return (
    <FormBuilderContext
      value={props.value}
      schema={props.schema}
      patchChannel={props.patchChannel}
      resolveInputComponent={inputResolver}
      resolvePreviewComponent={previewResolver}
    >
      {props.children}
    </FormBuilderContext>
  )
}

LyraFormBuilderContext.createPatchChannel =
  FormBuilderContext.createPatchChannel
