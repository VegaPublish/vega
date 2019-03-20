// @flow
import React from 'react'
import LyraFormBuilderContext from './LyraFormBuilderContext'
import {FormBuilderInput} from '../FormBuilderInput'
import {Marker} from '../typedefs'

type PatchChannel = {
  subscribe: () => () => {},
  receivePatches: (patches: Array<*>) => void
}

type Props = {
  value: ?any,
  schema: any,
  type: Object,
  markers: Array<Marker>,
  patchChannel: PatchChannel,
  onFocus: Path => void,
  path: Path,
  readOnly: boolean,
  onChange: () => {},
  onBlur: () => void,
  autoFocus: boolean,
  focusPath: Path
}

export default class LyraFormBuilder extends React.Component<Props> {
  _input: ?FormBuilderInput

  setInput = (input: ?FormBuilderInput) => {
    this._input = input
  }

  componentDidMount() {
    const {autoFocus} = this.props
    if (this._input && autoFocus) {
      this._input.focus()
    }
  }

  render() {
    const {
      value,
      schema,
      patchChannel,
      type,
      path,
      onChange,
      readOnly,
      markers,
      onFocus,
      onBlur,
      focusPath
    } = this.props

    return (
      <LyraFormBuilderContext
        value={value}
        schema={schema}
        patchChannel={patchChannel}
      >
        <FormBuilderInput
          type={type}
          path={path}
          onChange={onChange}
          level={0}
          value={value}
          onFocus={onFocus}
          onBlur={onBlur}
          markers={markers}
          focusPath={focusPath}
          isRoot
          readOnly={readOnly}
          ref={this.setInput}
        />
      </LyraFormBuilderContext>
    )
  }
}

LyraFormBuilder.createPatchChannel = LyraFormBuilderContext.createPatchChannel
