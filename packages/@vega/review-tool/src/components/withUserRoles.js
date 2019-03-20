// @flow
/* eslint-disable react/no-multi-comp */
import React from 'react'
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators'
import {withPropsStream} from 'react-props-stream'
import {rolesOnDocument} from 'part:@vega/datastores/role'

const qualifyingRoleNames = ['reviewer', 'editor', 'admin']

const connect = props$ =>
  props$.pipe(
    distinctUntilChanged(
      (props, nextProps) =>
        props.subjectType === nextProps.subjectType &&
        props.subjectId === nextProps.subjectId
    ),
    switchMap(props => {
      const doc = {
        _type: props.subjectType,
        _id: props.subjectId
      }
      return rolesOnDocument(qualifyingRoleNames, doc).pipe(
        map(roles => ({...props, roles}))
      )
    })
  )

// not yet in use
export function withUserRoles(Component: React.Component<*>) {
  return withPropsStream(connect, Component)
}

export const WithUserRoles = withPropsStream(connect, props =>
  props.children(props.roles)
)
