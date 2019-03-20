import React from 'react'
import {withPropsStream} from 'react-props-stream'
import {switchMap, map} from 'rxjs/operators'
import observableWithQuery from '../../util/observableWithQuery'
import InviteLink from './InviteLink'

function inviteForReviewerQuery(reviewerId) {
  return `*[_type == 'invite' && references("${reviewerId}")][0]`
}

function loadProps(props$) {
  return props$.pipe(
    switchMap(props =>
      observableWithQuery(inviteForReviewerQuery(props.reviewer._id)).pipe(
        map(invite => ({...props, invite}))
      )
    )
  )
}

class InviteLinkForReviewer extends React.PureComponent<*> {
  render() {
    const {invite} = this.props
    return invite ? <InviteLink invite={invite} /> : 'No invite for user'
  }
}

export default withPropsStream(loadProps, InviteLinkForReviewer)
