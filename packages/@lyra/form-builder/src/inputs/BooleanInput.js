// @flow
import React from 'react'
import Switch from 'part:@lyra/components/toggles/switch'
import Checkbox from 'part:@lyra/components/toggles/checkbox'
import PatchEvent, {set} from '../PatchEvent'
import type {Type} from '../typedefs'

type Props = {
  type: Type,
  value: ?boolean,
  readOnly: ?boolean,
  level: number,
  description: ?string,
  onChange: PatchEvent => void
}

// Todo: support indeterminate state, see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
export default class BooleanInput extends React.Component<Props> {
  _input: ?(Checkbox | Switch)

  handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    this.props.onChange(PatchEvent.from(set(event.currentTarget.checked)))
  }

  focus() {
    if (this._input) {
      this._input.focus()
    }
  }

  setInput = (input: ?(Checkbox | Switch)) => {
    this._input = input
  }

  render() {
    const {value, type, readOnly, level, description, ...rest} = this.props
    const options = type.options || {}
    const isCheckbox = options.layout === 'checkbox'
    const displayIndeterminateAs = options.displayIndeterminateAs

    return isCheckbox ? (
      <Checkbox
        {...rest}
        displayIndeterminateAs={displayIndeterminateAs}
        readOnly={readOnly}
        onChange={this.handleChange}
        checked={value}
        ref={this.setInput}
        description={type.description}
      >
        {type.title}
      </Checkbox>
    ) : (
      <Switch
        {...rest}
        displayIndeterminateAs={displayIndeterminateAs}
        readOnly={readOnly}
        onChange={this.handleChange}
        checked={value}
        label={type.title}
        description={type.description}
        ref={this.setInput}
      />
    )
  }
}
