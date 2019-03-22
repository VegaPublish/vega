import React from 'react'
import Button from 'part:@lyra/components/buttons/default'
import client from 'part:@lyra/base/client'
import LoginWrapper from 'part:@lyra/base/login-wrapper'
import styles from './styles/AcceptUserInvite.css'

type Props = {
  invite: any,
  identity: any,
  user: any,
  venue: any
}

export default class AcceptUserInvite extends React.Component<Props> {
  state = {claimSuccessful: false}

  handleLogout() {
    client.auth.logout()
    document.location.reload()
  }

  handleAcceptInvite = () => {
    const {invite, venue} = this.props
    const claimUrl = `/invitations/claim/${invite._id}?venueId=${venue.dataset}`
    client
      .request({
        url: claimUrl
      })
      .then(result => this.setState({claimSuccessful: result.claimed}))
  }

  render() {
    const {venue, user, identity} = this.props
    const {claimSuccessful} = this.state

    if (claimSuccessful) {
      return (
        <div className={styles.root}>
          <h2>Congratulations!</h2>
          <p>You are now logged</p>
          <p>
            <a href="/">Continue to Vega…</a>
          </p>
        </div>
      )
    }
    if (user && identity) {
      return (
        <div className={styles.root}>
          <div>
            <p>You are already signed in as {user.name}</p>
            <div>
              <a href="/">Continue to Vega…</a>
            </div>
          </div>
        </div>
      )
    }
    return (
      <LoginWrapper
        title={`You have been invited to join ${venue.title}`}
        description="First you need to sign in…"
      >
        <div className={styles.root}>
          <div>
            <h2>
              You are signed in as {(identity || {}).name} and can accept
              invitation
            </h2>
            <Button onClick={this.handleAcceptInvite} color="primary">
              Accept invitation and proceed
            </Button>{' '}
          </div>
          <br />
          <div>
            …or you can <Button onClick={this.handleLogout}>Sign out</Button>{' '}
            and sign in with another account
          </div>
        </div>
      </LoginWrapper>
    )
  }
}
