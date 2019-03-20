import PropTypes from 'prop-types'
import React from 'react'
import styles from 'part:@lyra/components/menus/default-style'
import Ink from 'react-ink'
import enhanceWithClickOutside from 'react-click-outside'
import {StateLink, IntentLink} from 'part:@vega/core/router'
import EditIcon from 'part:@lyra/base/edit-icon'

class StateMenu extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    origin: PropTypes.oneOf([
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right'
    ]),
    ripple: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
    onClickOutside: PropTypes.func,
    onClose: PropTypes.func,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        stateOptions: PropTypes.object,
        intentOptions: PropTypes.object,
        icon: PropTypes.func
      })
    )
  }

  static defaultProps = {
    isOpen: false,
    origin: 'top-left',
    ripple: true,
    onClickOutside() {},
    onClose() {}
  }

  handleClickOutside = () => {
    this.props.onClickOutside()
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown, false)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown, false)
  }

  handleKeyDown = event => {
    if (event.key == 'Escape') {
      this.props.onClose()
    }
  }

  handleItemOnClick = () => {
    this.props.onClose()
  }

  render() {
    const {items, origin, ripple, fullWidth, className} = this.props
    const originStyle = styles[`origin__${origin}`]
    const completeClassName = `${
      this.props.isOpen ? styles.isOpen : styles.closed
    } ${originStyle} ${fullWidth && styles.fullWidth} ${className}`
    return (
      <div className={completeClassName}>
        <ul className={styles.list}>
          {items.map(item => {
            const Icon = item.icon || (props => <span />)
            return (
              <li
                key={item.key}
                className={`${styles.item} ${item.divider && styles.divider}`}
              >
                <StateLink
                  {...item.props}
                  className={styles.link}
                  title={item.title}
                  onClick={this.handleItemOnClick}
                >
                  <span className={styles.iconContainer}>
                    <Icon />
                  </span>
                  {item.title}
                </StateLink>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default enhanceWithClickOutside(StateMenu)
