import React from 'react'
import Button from 'part:@lyra/components/buttons/default'
import Copy from 'react-icons/lib/fa/copy'
import Check from 'react-icons/lib/fa/check'
import copy from 'copy-text-to-clipboard'

import TextInput from 'part:@lyra/components/textinputs/default'

export default class CopyInput extends React.PureComponent<*> {
  state = {copied: false}

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.copied && this.state.copied) {
      clearTimeout(this._copiedTimerId)
      this._copiedTimerId = setTimeout(
        () => this.setState({copied: false}),
        5000
      )
    }
  }
  render() {
    const {content} = this.props
    const {copied} = this.state
    return (
      <div style={{display: 'flex', width: '100%'}}>
        <div style={{flexGrow: 1}}>
          <TextInput
            value={content}
            readOnly
            onClick={e => e.target.select()}
          />
        </div>
        <Button
          color="primary"
          icon={copied ? Check : Copy}
          title={copied ? 'Copied!' : 'Copy to clipboard'}
          onClick={() => this.setState({copied: copy(content)})}
        />
      </div>
    )
  }
}
