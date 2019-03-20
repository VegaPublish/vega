import PropTypes from 'prop-types'
import React from 'react'
import styles from 'part:@lyra/components/toggles/switch-style'

export default class Switch extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    markers: PropTypes.array,
    checked: PropTypes.bool,
    displayIndeterminateAs: PropTypes.oneOf([true, false, 'indeterminate']),
    disabled: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    readOnly: PropTypes.bool
  }

  static defaultProps = {
    onFocus: () => {},
    onBlur: () => {}
  }

  state = {
    hasFocus: false
  }

  componentDidMount() {
    const {checked, displayIndeterminateAs} = this.props
    if (
      displayIndeterminateAs === 'indeterminate' &&
      typeof checked === 'undefined' &&
      this._input
    ) {
      this._input.indeterminate = true
    }
  }

  handleFocus = event => {
    this.setState({hasFocus: true})
    this.props.onFocus(event)
  }

  handleBlur = event => {
    this.setState({hasFocus: false})
    this.props.onBlur(event)
  }

  focus() {
    if (this._input) {
      this._input.focus()
    }
  }

  setInput = el => {
    this._input = el
  }

  getDisplayValue() {
    const {checked, displayIndeterminateAs} = this.props
    if (typeof checked === 'undefined') {
      return displayIndeterminateAs === 'indeterminate'
        ? undefined
        : displayIndeterminateAs === true
    }
    return checked
  }

  render() {
    const {
      disabled,
      markers,
      checked: _ignore,
      displayIndeterminateAs,
      label,
      description,
      readOnly,
      ...rest
    } = this.props
    const {hasFocus} = this.state

    const checked = this.getDisplayValue()
    let thumbClass = checked ? styles.thumbChecked : styles.thumb

    if (typeof checked === 'undefined') {
      thumbClass = styles.thumbIndeterminate
    }

    return (
      <label
        className={`
          ${disabled || readOnly ? styles.isDisabled : styles.isEnabled}
          ${typeof checked === 'undefined' ? styles.indeterminate : styles.root}
          ${checked ? styles.isChecked : styles.unChecked}
          ${hasFocus ? styles.hasFocus : ''}
        `}
        onBlur={this.handleBlur}
      >
        <div className={styles.inner}>
          <div className={styles.track} />
          <div className={thumbClass}>
            <div className={styles.focusHelper} />
          </div>

          <input
            {...rest}
            className={styles.input}
            type="checkbox"
            disabled={disabled || readOnly}
            checked={checked}
            ref={this.setInput}
            onFocus={this.handleFocus}
          />
          <div className={styles.label}>{label}</div>
          {description && (
            <div className={styles.description}>{description}</div>
          )}
        </div>
      </label>
    )
  }
}
