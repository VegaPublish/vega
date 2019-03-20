// @flow
// Connects the FormBuilder with various lyra roles
import React from 'react'
import Button from 'part:@lyra/components/buttons/default'
import {FormBuilderInput} from 'part:@lyra/form-builder'
import PatchEvent, {unset} from 'part:@lyra/form-builder/patch-event'

export default class EditDate extends React.PureComponent<*, *> {
  props: {
    value: Object,
    field: Object,
    onChange: PatchEvent => void
  }

  handleDelete = () => {
    const {onChange, field} = this.props
    onChange(PatchEvent.from([unset([field.name])]))
  }

  handleChange = (event: PatchEvent) => {
    const {onChange, field} = this.props
    onChange(event.prefixAll(field.name))
  }

  render() {
    const {value, field} = this.props
    return (
      <div>
        <FormBuilderInput
          type={field.type}
          value={value}
          level={1}
          onChange={this.handleChange}
        />
        <div>
          <Button type="button" onClick={this.handleDelete}>
            Unset
          </Button>
        </div>
      </div>
    )
  }
}
