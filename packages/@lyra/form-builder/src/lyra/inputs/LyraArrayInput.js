import React from 'react'
import resolveUploader from '../uploads/resolveUploader'
import ArrayInput from '../../inputs/ArrayInput'

export default class LyraArray extends React.Component {
  setInput = input => {
    this.input = input
  }
  focus() {
    this.input.focus()
  }
  render() {
    return (
      <ArrayInput
        ref={this.setInput}
        {...this.props}
        resolveUploader={resolveUploader}
      />
    )
  }
}
