import React from 'react'
// import NotificationsWidget from '../../../../src/components/Notifications/Widget'
// import NotificationsFeed from '../../../../src/components/Notifications/Feed'

export default function TODO() {
  return <div>TODO</div>
}

/*
import lyraClient from 'part:@lyra/base/client'

const notificationsQuery = `
* [_type == "conversation"]
  | order(_createdAt desc)
  [0...10]
  {
    ...,
    _createdAt,
    sender -> {
      name,
      profileImage{
        asset->{url}
      }
    },
    subject -> {
      title
    }
  }
`

export default class NotificationsContainer extends React.Component {
  state = {
    isOpen: false,
    notifications: []
  }

  handleOpen = () => {
    localStorage.setItem('vegaLastViewdNotifications', new Date())
    this.setState({
      isOpen: !this.state.isOpen,
      newNotificationsQty: 0
    })
  }

  handleClose = () => {
    this.setState({
      isOpen: false
      // todo: not in use
      // lastViewed: localStorage.getItem('vegaLastViewdNotifications')
    })
  }

  fetchNotifications() {
    return lyraClient.fetch(notificationsQuery)
  }

  setNotifications = notifications => {
    let newNotificationsQty = 0

    const lastViewed = new Date(
      localStorage.getItem('vegaLastViewdNotifications')
    )

    notifications.map(notification => {
      const createdAt = new Date(notification._createdAt)

      if (createdAt > lastViewed) {
        newNotificationsQty++
        notification.isNew = true
      }
      return notification
    })

    this.setState({
      notifications: notifications,
      newNotificationsQty: newNotificationsQty
    })
  }

  componentDidMount() {
    this.fetchNotifications().then(notifications => {
      this.setNotifications(notifications)

      lyraClient.listen(notificationsQuery).subscribe(res => {
        let newNotifications = res.result

        if (
          Object.prototype.toString.call(newNotifications) !== '[object Array]'
        ) {
          // lyra makes the collection to a object if 1
          newNotifications = [newNotifications]
        }

        const allNotifications = [newNotifications].concat(
          this.state.notifications
        )
        this.setNotifications(allNotifications)
      })
    })
  }

  render() {
    const {isOpen, notifications, newNotificationsQty} = this.state
    return (
      <NotificationsWidget
        onOpen={this.handleOpen}
        isOpen={isOpen}
        newNotificationsQty={newNotificationsQty}
      >
        {isOpen && <NotificationsFeed notifications={notifications} />}
      </NotificationsWidget>
    )
  }
}

*/
