import React from 'react'
import Button from 'part:@lyra/components/buttons/default'
import EditIcon from 'part:@lyra/base/edit-icon'

type Props = {
  onClick: void => void,
  children: React.Element<*>
}

export default class EditButton extends React.Component<Props> {
  handleClick = event => {
    this.props.onClick(event)
  }
  render() {
    return (
      <Button kind="simple" icon={EditIcon} onClick={this.handleClick}>
        {this.props.children}
      </Button>
    )
  }
}
