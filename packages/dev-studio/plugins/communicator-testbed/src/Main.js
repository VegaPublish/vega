import React from 'react'
import CommentList from '@vega/communicator-system/lib/components/providers/ThreadList'
import {StateLink, withRouterHOC} from 'part:@vega/core/router'

export default withRouterHOC(props => {
  const viewOptions = props.router.state.viewOptions || {}
  const scope = {issue: viewOptions.issue, article: viewOptions.article}
  return (
    <React.Fragment>
      <StateLink
        state={{viewOptions: {issue: 'issue_99217ad7755dbefb8bc0beabaa87d777'}}}
      >
        Go to issue
      </StateLink>
      <div style={{height: '500px', overflow: 'auto'}}>
        <CommentList scope={scope} />
      </div>
    </React.Fragment>
  )
})
