import React from 'react'
import {observePaths} from 'part:@lyra/base/preview'
import {withPropsStream} from 'react-props-stream'
import {map, switchMap} from 'rxjs/operators'
import CopyInput from '@vega/components/CopyInput'
import {currentVenue$} from 'part:@vega/datastores/venue'
import resolveInviteLink from '@vega/utils/resolveInviteLink'
import {combineLatest} from 'rxjs'

function loadProps(props$) {
  return combineLatest(props$, currentVenue$).pipe(
    switchMap(([props, currentVenue]) =>
      observePaths(props.invite, ['_id']).pipe(
        map(invite => ({...props, invite, currentVenue}))
      )
    )
  )
}

class InviteLink extends React.PureComponent<*> {
  render() {
    const {invite, currentVenue} = this.props
    const inviteLink = resolveInviteLink(currentVenue.dataset, invite._id)
    return invite ? (
      <CopyInput content={inviteLink} />
    ) : (
      'No invite available for user'
    )
  }
}

export default withPropsStream(loadProps, InviteLink)
