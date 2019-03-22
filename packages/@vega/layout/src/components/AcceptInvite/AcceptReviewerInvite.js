/* eslint-disable max-len */
import React from 'react'
import Button from 'part:@lyra/components/buttons/default'
import lyraClient from 'part:@lyra/base/client'
import styles from './styles/AcceptReviewerInvite.css'
import client from 'part:@lyra/base/client'
import locationStore from 'part:@lyra/base/location'

function markReviewItemAsAccepted(userId) {
  const query = `*[_type == "reviewItem" && reviewer._ref == "${userId}"][0]{...}`
  return lyraClient.fetch(query).then(reviewItem => {
    return lyraClient
      .patch(reviewItem._id)
      .set({acceptState: 'accepted'})
      .commit()
  })
}

type Props = {
  invite: any,
  user: any,
  venue: boolean
}

export default class AcceptReviewerInvite extends React.Component<Props> {
  handleAcceptInvite = () => {
    const {invite, user, venue} = this.props
    const claimUrl = `/invitations/claim/${invite._id}?venueId=${venue.dataset}`
    const maybeLogout = user ? client.auth.logout() : Promise.resolve()
    maybeLogout
      .then(() =>
        client.request({
          url: claimUrl
        })
      )
      .then(() => markReviewItemAsAccepted(invite.target._ref))
      .then(() => locationStore.actions.navigate('/'))
  }

  render() {
    const {invite, user, venue} = this.props

    return (
      <div className={styles.root}>
        <div>
          <div className={styles.header}>
            <div className={styles.headerInner} />
          </div>
          <h2>Invitation to review article in {venue.title}</h2>
          <p>{invite.message}</p>
          {user ? (
            <div>
              <p>
                You are currently logged in as {user.name}. In order to accept
                this invitation you will have to log out first.
              </p>
              <div className={styles.choices}>
                <div>
                  <Button onClick={this.handleAcceptInvite} color="primary">
                    Logout and accept invitation to become reviewer
                  </Button>{' '}
                </div>
                <div>or</div>
                <div>
                  <a href="/">Continue in Vega as {user.name}</a>
                </div>
              </div>
            </div>
          ) : (
            <Button onClick={this.handleAcceptInvite} color="primary">
              Accept invitation to become reviewer
            </Button>
          )}
        </div>
      </div>
    )
  }
}
