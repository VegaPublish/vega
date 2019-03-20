import React from 'react'
import {withRouterHOC} from 'part:@vega/core/router'

export default function withViewOptions(Component) {
  return withRouterHOC(props => {
    const {router, ...rest} = props
    return (
      <Component
        viewOptions={router.state && router.state.viewOptions}
        {...rest}
      />
    )
  })
}
