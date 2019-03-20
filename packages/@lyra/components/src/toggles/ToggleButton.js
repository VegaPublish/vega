import PropTypes from 'prop-types'
import React from 'react'
import styles from 'part:@lyra/components/toggles/button-style'
import Button from 'part:@lyra/components/buttons/default'

export default class ToggleButton extends React.Component {
  static propTypes = {
    icon: PropTypes.func,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    title: PropTypes.string
  }

  static defaultProps = {
    className: '',
    disabled: false
  }

  render() {
    const {disabled, selected, icon, className, title} = this.props
    const buttonClasses = `
      ${selected ? styles.selected : styles.unSelected}
      ${className}
    `
    return (
      <Button
        className={buttonClasses}
        icon={icon}
        title={title}
        disabled={disabled}
        onClick={this.props.onClick}
        kind="simple"
      >
        {this.props.children}
      </Button>
    )
  }
}
