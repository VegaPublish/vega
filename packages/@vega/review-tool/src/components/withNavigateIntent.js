import React from 'react'
import {withRouterHOC} from 'part:@vega/core/router'

export default function withNavigateIntent(Component) {
  return withRouterHOC(props => {
    const {router, ...rest} = props
    return <Component navigateIntent={router.navigateIntent} {...rest} />
  })
}
