import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/Notification.css'
import {capitalize} from 'lodash'

import {IntentLink} from 'part:@vega/core/router'
import TimeSince from './TimeSince'

function getActionTitle(name) {
  return capitalize(name)
}

export default class Notification extends React.PureComponent {
  static propTypes = {
    notification: PropTypes.shape({
      id: PropTypes.string,
      body: PropTypes.string,
      title: PropTypes.string,
      date: PropTypes.object,
      user: PropTypes.object,
      onAction: PropTypes.func
    })
  }

  state = {
    actionResult: {}
  }

  handleAction = ev => {
    const actionName = ev.target.getAttribute('data-action-name')
    const {notification} = this.props
    notification.onAction(actionName).subscribe({
      next: () => {
        this.setState({actionResult: {action: actionName, ok: true}})
      },
      error: err => {
        this.setState({
          actionResult: {action: actionName, ok: false, error: err}
        })
      }
    })
  }
  renderAction = actionName => {
    const {actionResult} = this.state
    return (
      <button
        type="button"
        onClick={this.handleAction}
        data-action-name={actionName}
      >
        {getActionTitle(actionName)}
        {actionResult.action === actionName && actionResult.ok && ' ✔︎'}
      </button>
    )
  }

  render() {
    const {notification} = this.props

    const contents = (
      <React.Fragment>
        <div className={styles.title}>{notification.title}</div>
        <div className={styles.body}>{notification.description}</div>
      </React.Fragment>
    )

    return (
      <div className={styles.root}>
        <div className={styles.media}>
          {notification.imageUrl ? (
            <img src={notification.imageUrl} className={styles.image} />
          ) : (
            <div className={styles.noImage} />
          )}
        </div>

        <div className={styles.content}>
          {notification.timestamp && (
            <div className={styles.date}>
              <TimeSince
                resolution="seconds"
                timestamp={notification.timestamp}
                addSuffix
                includeSeconds
              />
            </div>
          )}
          {notification.intent ? (
            <IntentLink
              className={styles.link}
              intent={notification.intent.name}
              params={{
                id: notification.intent.id,
                type: notification.intent.type
              }}
            >
              {contents}
            </IntentLink>
          ) : (
            contents
          )}
          <span className={styles.actions}>
            {notification.actions &&
              notification.actions.map(this.renderAction)}
          </span>
        </div>
      </div>
    )
  }
}
