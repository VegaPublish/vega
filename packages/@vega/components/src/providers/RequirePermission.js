// @flow
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators'
import {combineLatest} from 'rxjs'
import {withPropsStream} from 'react-props-stream'
import {canPerformAction} from 'part:@vega/datastores/role'

function getPropsStream(props$) {
  const canUserPerformAction$ = props$.pipe(
    distinctUntilChanged(
      (props, nextProps) =>
        props.action === nextProps.action && props.subject === nextProps.subject
    ),
    switchMap(props => {
      return canPerformAction(props.action, props.subject)
    })
  )

  return combineLatest([props$, canUserPerformAction$]).pipe(
    map(([props, canUserPerformAction]) => {
      return {
        children: props.children,
        permissionGranted: canUserPerformAction,
        isLoading: false
      }
    })
  )
}

type Props = {
  permissionGranted: boolean,
  isLoading: boolean,
  children: Function
}

function RequirePermission(props: Props) {
  const {isLoading, children, permissionGranted} = props
  if (isLoading) {
    return null
  }
  return children({permissionGranted})
}

export default withPropsStream(getPropsStream, RequirePermission)
