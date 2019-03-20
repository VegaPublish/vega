import PropTypes from 'prop-types'
import React from 'react'
import {BlockEditor} from 'part:@lyra/form-builder'

export default class CommentBlockEditor extends React.Component {
  static propTypes = {
    type: PropTypes.shape({
      title: PropTypes.string
    }).isRequired,
    level: PropTypes.number,
    value: PropTypes.array,
    markers: PropTypes.array,
    onChange: PropTypes.func.isRequired
  }

  handlePaste = input => {
    const {event, path} = input
    const jsonData = event.clipboardData.getData('application/json')
    if (jsonData) {
      const data = JSON.parse(jsonData)
      return {insert: data, path}
    }
    return undefined
  }

  render() {
    return (
      <div>
        <BlockEditor {...this.props} onPaste={this.handlePaste} />
      </div>
    )
  }
}
