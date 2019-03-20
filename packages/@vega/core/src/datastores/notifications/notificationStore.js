import notificationProviders from 'all:part:@vega/attention/notification-provider?'
import {of as observableOf, merge, combineLatest} from 'rxjs'
import {map, publishReplay, refCount} from 'rxjs/operators'
import {flatten, orderBy} from 'lodash'
import {prepareProviders} from './utils'

function validateProvider(provider) {
  if (!provider.notifications$) {
    // eslint-disable-next-line no-console
    console.warn(
      `Invalid notification provider. Missing notifications$. Please check the implementation of ${
        provider.name
      }`
    )
    return false
  }
  return true
}

const providers = prepareProviders(notificationProviders).filter(
  validateProvider
)

const streams = providers.map(provider => {
  const {notifications$, onAction, ...etc} = provider
  return merge(observableOf([]), notifications$).pipe(
    map(notifications =>
      notifications.map(notification => {
        const notificationId = `${provider.id}_${notification.id}`
        return {
          provider: etc,
          ...notification,
          id: notificationId,
          timestamp: notification.timestamp || new Date(),
          onAction(actionName) {
            onAction({name: actionName, notification: notification})
          }
        }
      })
    )
  )
})

const notifications$ = combineLatest(streams).pipe(
  map(flatten),
  publishReplay(1),
  refCount()
)

export default {
  notifications$: notifications$.pipe(
    map(notifications => orderBy(notifications, n => -n.timestamp))
  ),
  count$: notifications$.pipe(map(notifications => notifications.length))
}
