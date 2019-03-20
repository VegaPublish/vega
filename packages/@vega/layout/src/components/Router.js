import React from 'react'
import Layout from './Layout'
import FourOhFour from './FourOhFour'
import {router} from '../router'
import urlState$ from 'part:@vega/core/datastores/urlstate'
import LoginWrapper from 'part:@lyra/base/login-wrapper'
import {RouterProvider} from 'part:@vega/core/router'
import locationStore from 'part:@lyra/base/location'
import AcceptInvite from './AcceptInvite'

export default class Router extends React.Component {
  state = {
    urlState: null
  }

  constructor() {
    super()
    let sync = true
    const setState = state => {
      if (sync) {
        this.state = state
      } else this.setState(state)
    }
    this.urlStateSubscription = urlState$.subscribe(event => {
      setState({
        urlState: event.state,
        notFound: event.notFound
      })
    })
    sync = false
  }

  componentWillUnmount() {
    this.urlStateSubscription.unsubscribe()
  }

  handleNavigate = (newUrl, options) => {
    locationStore.actions.navigate(newUrl, options)
  }

  renderContent(urlState) {
    if (urlState.inviteToken) {
      return (
        <AcceptInvite
          inviteToken={urlState.inviteToken}
          venue={urlState.venue}
        />
      )
    }
    return (
      <LoginWrapper>
        <Layout />
      </LoginWrapper>
    )
  }
  render() {
    const {urlState, notFound} = this.state

    if (!urlState) {
      // wait for it
      return null
    }

    return (
      <RouterProvider
        router={router}
        state={urlState}
        onNavigate={this.handleNavigate}
      >
        <div>{notFound ? <FourOhFour /> : this.renderContent(urlState)}</div>
      </RouterProvider>
    )
  }
}
