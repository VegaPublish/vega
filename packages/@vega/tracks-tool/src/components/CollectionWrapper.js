import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/CollectionWrapper.css'
import ArrowDropDown from 'part:@lyra/base/arrow-drop-down'
import Button from 'part:@lyra/components/buttons/default'
import AnimateHeight from 'react-animate-height'

export default class CollectionWrapper extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    qty: PropTypes.number,
    isOpen: PropTypes.bool,
    onOpen: PropTypes.func,
    isSelected: PropTypes.bool
  }

  static defaultProps = {
    title: 'Untitled…'
  }

  render() {
    const {title, qty, onOpen, isOpen, isSelected} = this.props

    return (
      <div
        className={`
          ${isSelected ? styles.isSelectedForCommunicator : ''}
          ${isOpen ? styles.isOpen : styles.isClosed}
        `}
      >
        <h2 className={styles.title} onClick={onOpen}>
          {title}
          {qty && <div className={styles.tasksQty}>{qty}</div>}
        </h2>
        <Button kind="simple" className={styles.arrowDropDown} onClick={onOpen}>
          <ArrowDropDown />
        </Button>
        <div className={styles.contentWrapper}>
          <AnimateHeight
            height={isOpen && this.props.children ? 'auto' : 0}
            className={styles.collapsable}
          >
            <div className={styles.content}>{this.props.children}</div>
          </AnimateHeight>
        </div>
      </div>
    )
  }
}
