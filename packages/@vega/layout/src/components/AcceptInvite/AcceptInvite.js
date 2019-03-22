import React from 'react'
import {combineLatest} from 'rxjs'
import {withPropsStream} from 'react-props-stream'
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators'
import {currentVenue$} from 'part:@vega/datastores/venue'
import {currentUser$, currentIdentity$} from 'part:@vega/datastores/user'
import client from 'part:@lyra/base/client'
import AcceptReviewerInvite from './AcceptReviewerInvite'
import AcceptUserInvite from './AcceptUserInvite'

const request = url => client.request({url})

// Load stages and render dots for each article that has a stage
const loadProps = props$ => {
  const invite$ = combineLatest(
    props$.pipe(map(props => props.inviteToken)),
    currentVenue$
  ).pipe(
    map(
      ([inviteToken, currentVenue]) =>
        `/invitations/${inviteToken}?venueId=${currentVenue.dataset}`
    ),
    distinctUntilChanged(),
    switchMap(request)
  )
  return combineLatest(
    props$,
    currentVenue$,
    currentUser$,
    currentIdentity$,
    invite$
  ).pipe(
    map(([props, currentVenue, currentUser, currentIdentity, invite]) => ({
      currentVenue,
      currentUser,
      currentIdentity,
      invite
    }))
  )
}
export default withPropsStream(
  loadProps,
  class AcceptInvite extends React.Component {
    render() {
      const {invite, currentUser, currentIdentity, currentVenue} = this.props
      if (!invite) {
        return 'Invite not found'
      }
      const Accept =
        invite.targetType === 'guest' ? AcceptReviewerInvite : AcceptUserInvite
      return (
        <Accept
          identity={currentIdentity}
          user={currentUser}
          venue={currentVenue}
          invite={invite}
        />
      )
    }
  }
)
