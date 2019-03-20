import {DEBUG, fromEvent} from './debug-helpers'
import {Subject, merge, NEVER} from 'rxjs'
import {map, scan, filter} from 'rxjs/operators'

const action$ = new Subject()

const add$ = fromEvent('click', window).pipe(
  filter(
    e => e.screenX < window.innerWidth / 2 && e.screenY > window.innerHeight / 2
  ),
  map(event => ({
    op: 'add',
    notification: {
      title: `User clicked to the left ${event.clientX}x${event.clientY}`,
      description: `User clicked at ${event.clientX}x${event.clientY}`,
      actions: ['dismiss'],
      id: Math.random()
        .toString(32)
        .substring(2),
      timestamp: new Date()
    }
  }))
)

export default {
  title: 'Clicks to the left (append)',
  onAction(action) {
    action$.next({op: action.name, notification: action.notification})
  },
  notifications$: DEBUG
    ? merge(add$, action$.asObservable()).pipe(
        scan((notifications, action) => {
          if (action.op === 'add') {
            return notifications.concat(action.notification)
          }
          if (action.op === 'dismiss') {
            return notifications.filter(
              notification => notification.id !== action.notification.id
            )
          }

          return notifications
        }, [])
      )
    : NEVER
}
