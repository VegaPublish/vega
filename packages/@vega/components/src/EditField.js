import PropTypes from 'prop-types'
import React from 'react'
import {FormBuilder} from 'part:@lyra/form-builder'

export default class EditField extends React.PureComponent {
  state = {
    focusPath: []
  }
  static propTypes = {
    value: PropTypes.any,
    hideLabel: PropTypes.bool,
    field: PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.object
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    patchChannel: PropTypes.object
  }

  handleChange = event => {
    const {onChange, field} = this.props
    onChange(event.prefixAll(field.name))
  }
  handleFocus = nextFocusPath => {
    this.setState({focusPath: nextFocusPath})
  }

  render() {
    const {field, value, patchChannel} = this.props
    const {focusPath} = this.state
    // TODO: Hack to remove label from form builder, should probably
    // not be done in this manner ...
    let fieldType = field.type
    if (this.props.hideLabel == true) {
      fieldType = Object.assign({}, field.type)
      delete fieldType.title
    }

    return (
      <FormBuilder
        type={fieldType}
        value={value}
        focusPath={focusPath}
        onFocus={this.handleFocus}
        path={[field.name]}
        patchChannel={patchChannel}
        onChange={this.handleChange}
      />
    )
  }
}
