import locationStore from 'part:@lyra/base/location'
import config from 'config:lyra'
import {router} from 'part:@vega/router'
import client from 'part:@lyra/base/client'
import {get} from 'lodash'

import {from as observableFrom} from 'rxjs'

import {
  tap,
  filter,
  map,
  mergeMap,
  scan,
  publishReplay,
  refCount
} from 'rxjs/operators'

function navigate(url, options) {
  locationStore.actions.navigate(url, options)
}

function redirectToDefaultVenueAndTool() {
  const defaultVenue =
    config.venues.find(venue => venue.default) || config.venues[0]
  navigate(
    router.encode({
      venue: defaultVenue.dataset,
      tool: 'issues'
    }),
    {replace: true}
  )
}

function checkRedirectBase(event) {
  const redirect = router.getRedirectBase(event.location.pathname)
  if (redirect) {
    navigate(redirect, {replace: true})
    return null
  }
  return event
}

let currentState = null

function getCandidateWithCurrentPreferred(candidates) {
  return (
    (currentState &&
      candidates.find(
        candidate => candidate.tool.name === currentState.tool
      )) ||
    candidates[0]
  )
}

function checkRedirectIntent(event) {
  if (!event.state || !event.state.intent) {
    return Promise.resolve(event)
  }
  const tools = require('all:part:@lyra/base/tool')
  return Promise.all(
    tools.map(tool => {
      if (!tool.getIntentState) {
        return null
      }
      return Promise.resolve(
        tool.getIntentState(event.state.intent, event.state.params)
      ).then(state => (state ? {tool, state} : null))
    })
  )
    .then(candidates => candidates.filter(Boolean))
    .then(candidates => {
      const match = getCandidateWithCurrentPreferred(candidates)
      if (match) {
        const {tool, state} = match
        const url = router.encode({
          venue: event.state.params.venue || currentState.venue,
          tool: tool.name,
          [tool.name]: state
        })
        navigate(url, {replace: true})
      }
      return null
    })
}

function maybeRedirectToDefaults(event) {
  const state = event.state || {}
  if (!state.inviteToken && (!state.venue || !state.tool)) {
    redirectToDefaultVenueAndTool()
    return null
  }
  return event
}

export default observableFrom(locationStore.state).pipe(
  map(event => checkRedirectBase(event)),
  filter(Boolean),
  map(event => {
    return {
      type: event.type,
      notFound: router.isNotFound(event.location.pathname),
      state: router.decode(event.location.pathname)
    }
  }),
  mergeMap(checkRedirectIntent),
  filter(Boolean),
  map(maybeRedirectToDefaults),
  scan((prev, next) => {
    if (prev && get(prev, 'state.venue') !== get(next, 'state.venue')) {
      document.location.reload()
    }
    return next
  }, null),
  filter(Boolean),
  tap(event => {
    if (!event.notFound && event.state.venue) {
      client.config({dataset: event.state.venue})
    }
  }),
  tap(event => {
    currentState = event.state
  }),
  publishReplay(1),
  refCount()
)
