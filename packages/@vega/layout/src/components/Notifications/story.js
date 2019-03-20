import React from 'react'
import {storiesOf} from 'part:@lyra/storybook'
import {
  withKnobs,
  number,
  text,
  object,
  boolean
} from 'part:@lyra/storybook/addons/knobs'
import {range} from 'lodash'
import Chance from 'chance'
const chance = new Chance()

import NotificationsBadge from './Notification'
import NotificationsFeed from './NotificationsFeed'
import NotificationsWidget from './Widget'

function createUser() {
  return {
    name: chance.name(),
    profileImage: chance.avatar()
  }
}

function createNotification() {
  return {
    user: createUser(),
    _createdAt: new Date().toISOString(),
    _type: 'conversation',
    isNew: chance.bool({likelihood: 30}),
    isUnread: chance.bool({likelihood: 50}),
    subject: {
      title: chance.sentence()
    }
  }
}

storiesOf('Vega Notifications', module)
  .addDecorator(withKnobs)
  .add('Widget', () => {
    const notifications = range(number('notifications', 20)).map((item, i) => {
      return createNotification()
    })
    return (
      <div style={{position: 'absolute', top: '20%', left: '20%'}}>
        <NotificationsWidget
          newNotificationsQty={number('newNotificationsQty', 10)}
          isOpen={boolean('Is open', true)}
        >
          <NotificationsFeed notifications={notifications} />
        </NotificationsWidget>
      </div>
    )
  })
  .add('Notification', () => {
    const notification = {
      id: text('id', 'conversation-1'),
      user: object('person', createUser()),
      isNew: boolean('is new', false)
    }

    return (
      <NotificationsBadge notification={notification}>
        {text(
          'content',
          'this is the notification, and it should have som length because we are using ellipsis'
        )}
      </NotificationsBadge>
    )
  })
  .add('Notifications', () => {
    const notifications = range(number('notifications', 20)).map((item, i) => {
      return createNotification()
    })
    return (
      <div>
        <NotificationsFeed notifications={notifications} />
      </div>
    )
  })
