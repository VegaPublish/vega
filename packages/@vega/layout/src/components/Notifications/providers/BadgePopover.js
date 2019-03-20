// @flow
import {withPropsStream} from 'react-props-stream'
import notificationStore from 'part:@vega/core/datastores/notifications'
import NotificationsBadge from '../views/BadgePopover'

import {of as observableOf, combineLatest, Subject} from 'rxjs'
import {concat, map, scan, publishReplay, refCount} from 'rxjs/operators'

function createHandler() {
  const calls = new Subject()
  function onChange(...args) {
    calls.next(args)
  }
  onChange.calls$ = calls.asObservable()

  return onChange
}

function createStateHandlerWithState(initial) {
  const handler = createHandler()

  handler.state$ = observableOf(initial).pipe(
    concat(handler.calls$),
    publishReplay(1),
    refCount()
  )

  return handler
}

const loadProps = props$ => {
  const onToggle = createStateHandlerWithState(false)

  const isOpen$ = onToggle.state$.pipe(scan(prev => !prev))

  return combineLatest([
    props$,
    notificationStore.notifications$,
    notificationStore.count$,
    isOpen$
  ]).pipe(
    map(([props, notifications, count, isOpen]) => ({
      ...props,
      count,
      notifications,
      isOpen,
      onToggle
    }))
  )
}
export default withPropsStream(loadProps, NotificationsBadge)
