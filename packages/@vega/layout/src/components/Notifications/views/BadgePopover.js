// @flow
import React from 'react'
import styles from './styles/BadgePopover.css'
import Notification from './Notification'
import {Tooltip} from 'react-tippy'
import numbered from 'numbered'
import {capitalize} from 'lodash'

type NotificationProvider = {
  id: string,
  name: string,
  title: string,
  description: string
}

type NotificationT = {
  provider: NotificationProvider,
  title: string,
  body: string,
  timestamp: string,
  id: string
}

type Props = {
  notifications: NotificationT[],
  isOpen: boolean,
  count: number,
  onToggle: () => void,
  onRead: (string[]) => void
}

export default class BadgePopover extends React.PureComponent<Props> {
  handleClickOutside = () => {
    const {onToggle, isOpen} = this.props
    if (isOpen) {
      onToggle()
    }
  }

  handleClose = () => {
    if (this.props.isOpen) {
      this.props.onToggle()
    }
  }

  renderNotifications = () => {
    const {notifications, onRead} = this.props
    return (
      <div className={styles.feed}>
        {notifications.map(notification => (
          <Notification
            notification={notification}
            onRead={onRead}
            key={notification.id}
          />
        ))}
      </div>
    )
  }

  render() {
    const {count, onToggle, isOpen} = this.props

    return (
      <div className={isOpen ? styles.rootIsOpen : styles.rootIsClosed}>
        <Tooltip
          arrow
          theme="light noPadding"
          trigger="click"
          position="bottom"
          interactive
          duration={100}
          open={isOpen}
          onRequestClose={this.handleClose}
          style={{padding: 0}}
          html={this.renderNotifications()}
          useContext
        >
          <div
            onClick={count > 0 ? onToggle : null}
            title={`${
              count === 0 ? 'No' : capitalize(numbered.stringify(count))
            } unread notifications${count === 0 ? ' 🎉' : '---'}`}
            className={count === 0 ? styles.bubble : styles.bubbleWithUnread}
          >
            {count}
          </div>
        </Tooltip>
      </div>
    )
  }
}
