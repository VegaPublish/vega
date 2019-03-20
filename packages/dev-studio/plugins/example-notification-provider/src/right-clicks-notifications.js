import {DEBUG, fromEvent} from './debug-helpers'
import {NEVER} from 'rxjs'
import {map, filter} from 'rxjs/operators'

export default {
  title: 'Latest click to the right (update)',
  notifications$: DEBUG
    ? fromEvent('click', window).pipe(
        filter(
          e =>
            e.screenX > window.innerWidth / 2 &&
            e.screenY > window.innerHeight / 2
        ),
        map(event => [
          {
            title: `User clicked to the right`,
            description: `User clicked at ${event.clientX}x${event.clientY}`,
            timestamp: new Date(),
            id: 'clicks-on-right-half-of-screen'
          }
        ])
      )
    : NEVER
}
