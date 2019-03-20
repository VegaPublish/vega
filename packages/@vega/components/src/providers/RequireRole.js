// @flow
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators'
import {combineLatest} from 'rxjs'
import {withPropsStream} from 'react-props-stream'
import {rolesOnDocument} from 'part:@vega/datastores/role'

function getPropsStream(props$) {
  const roles$ = props$.pipe(
    distinctUntilChanged(
      (props, nextProps) =>
        props.qualifyingRoleNames === nextProps.qualifyingRoleNames &&
        props.subject === nextProps.subject
    ),
    switchMap(props => {
      return rolesOnDocument(props.qualifyingRoleNames, props.subject)
    })
  )

  return combineLatest([props$, roles$]).pipe(
    map(([props, roles]) => ({
      children: props.children,
      hasRole: roles.length > 0,
      isLoading: false
    }))
  )
}

type Props = {
  hasRole: boolean,
  isLoading: boolean,
  children: Function
}

function RequireRole(props: Props) {
  const {isLoading, children, hasRole} = props
  if (isLoading) {
    return null
  }
  return children({hasRole})
}

export default withPropsStream(getPropsStream, RequireRole)
