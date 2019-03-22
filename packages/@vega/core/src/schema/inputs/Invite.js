import React from 'react'
import {withPropsStream} from 'react-props-stream'
import {map, switchMap} from 'rxjs/operators'
import {combineLatest, of} from 'rxjs'
import client from 'part:@lyra/base/client'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import CopyInput from '@vega/components/CopyInput'
import resolveInviteLink from '@vega/utils/src/resolveInviteLink'
import {currentVenue$} from 'part:@vega/datastores/venue'
import Button from 'part:@lyra/components/buttons/default'
import UUID from '@lyra/uuid'
import styles from './Invite.css'

const INVITES_QUERY = `*[_type == 'invite' && target._ref == $userId]`
function invitesFor(userId) {
  return client.observable
    .listen(INVITES_QUERY, {userId}, {events: ['welcome', 'mutation']})
    .pipe(switchMap(ev => client.observable.fetch(INVITES_QUERY, {userId})))
}

export default withPropsStream(
  props$ => {
    const invites$ = props$.pipe(
      switchMap(props => {
        return props.document.identity
          ? of(props)
          : invitesFor(props.document._id)
      })
    )
    return combineLatest([props$, currentVenue$, invites$]).pipe(
      map(([props, currentVenue, invites]) => ({
        ...props,
        currentVenue,
        invites
      }))
    )
  },
  class Invite extends React.Component {
    state = {isCreating: false, isDeleting: false}
    handleDelete = inviteId => {
      const finalize = () => this.setState({isDeleting: false})
      this.setState({isDeleting: true})
      client
        .transaction()
        .delete(inviteId)
        .commit()
        .then(finalize, finalize)
    }
    handleCreateInvite = () => {
      const {document, currentVenue, invites = []} = this.props
      this.setState({isCreating: true})
      const finalize = () => this.setState({isCreating: false})
      const invite = {
        _id: UUID(),
        _type: 'invite',
        targetType: 'user',
        target: {_type: 'reference', _ref: document._id, _weak: true},
        isAccepted: false,
        isRevoked: false
      }
      client
        .transaction()
        .create(invite)
        .commit()
        .then(finalize, finalize)
    }

    render() {
      const {document, currentVenue, invites = []} = this.props
      const {isCreating, isDeleting} = this.state
      if (document.identity) {
        return <div>✅ Invitation has been accepted by {document.name}</div>
      }
      if (invites.length === 0) {
        return (
          <Button disabled={isCreating} onClick={this.handleCreateInvite}>
            Create invitation
          </Button>
        )
      }
      return (
        <div>
          {invites.map(invite => (
            <div key={invite._id}>
              <div className={styles.buttonCollection}>
                <CopyInput
                  content={resolveInviteLink(currentVenue.dataset, invite._id)}
                />
                <Button
                  color="danger"
                  disabled={isDeleting}
                  onClick={() => this.handleDelete(invite._id)}
                  title="Remove invite"
                >
                  ✕
                </Button>
              </div>
              <div className={styles.description}>
                Invited as {invite.targetType === 'guest' ? 'guest' : 'user'}{' '}
                {distanceInWordsToNow(invite._createdAt)} ago
              </div>
            </div>
          ))}
        </div>
      )
    }
  }
)
