// Connects the FormBuilder with various lyra roles
import PropTypes from 'prop-types'

import React from 'react'
import EditField from './EditField'

export default class EditDocumentField extends React.PureComponent {
  static propTypes = {
    fieldName: PropTypes.string.isRequired,
    hideLabel: PropTypes.bool,
    type: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    patchChannel: PropTypes.object
  }

  render() {
    const {
      type,
      fieldName,
      value,
      onChange,
      hideLabel,
      patchChannel
    } = this.props

    const field = type.fields.find(f => f.name === fieldName)

    const fieldValue = value[fieldName]

    if (!field) {
      throw new Error(
        `No such field "${fieldName}" defined for type ${type.name}`
      )
    }

    return (
      <EditField
        field={field}
        value={fieldValue}
        onChange={onChange}
        hideLabel={hideLabel}
        patchChannel={patchChannel}
      />
    )
  }
}
