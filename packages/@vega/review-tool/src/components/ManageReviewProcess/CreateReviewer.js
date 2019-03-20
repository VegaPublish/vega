import React from 'react'
import {FormBuilderInput} from 'part:@lyra/form-builder'

type Props = {
  onChange: any,
  value: any,
  type: any,
  focusPath: any,
  fieldName: any,
  onFocus: any,
  readOnly: boolean
}

export default class Field extends React.Component<Props> {
  handleChange = patchEvent => {
    const {onChange, fieldName} = this.props
    onChange(patchEvent.prefixAll(fieldName))
  }

  render() {
    const {value, type, focusPath, fieldName, onFocus, readOnly} = this.props
    const fieldType = type.fields.find(f => f.name === fieldName).type

    return (
      <FormBuilderInput
        path={[fieldName]}
        onFocus={onFocus}
        focusPath={focusPath}
        onChange={this.handleChange}
        type={fieldType}
        value={value ? value[fieldName] : undefined}
        readOnly={readOnly}
      />
    )
  }
}
