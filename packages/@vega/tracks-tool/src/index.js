import React from 'react'
import {route} from 'part:@vega/core/router'
import TracksTool from './components/TracksTool'
import routerParams from '@vega/utils/routerParams'

const icon = () => <span />

const INTENT_NAMES = ['show']
const ACCEPTED_TYPES = ['article', 'stage', 'track']

function canHandleIntent(intentName, params) {
  return (
    INTENT_NAMES.includes(intentName) && ACCEPTED_TYPES.includes(params.type)
  )
}

export default {
  name: 'tracks',
  title: 'Development',
  icon: icon,
  getIntentState(intentName, params) {
    if (!canHandleIntent(intentName, params)) {
      return null
    }

    if (intentName === 'edit') {
      if (params.type !== 'article') {
        return null
      }
      return {
        viewOptions: {
          article: params.id,
          edit: true
        }
      }
    }

    return {
      viewOptions: {
        [params.type]: params.id
      }
    }
  },

  // /journal-of-snah/tracks/track=original-articles;stage=review
  // will publish {tool: 'tracks', viewOptions: {track: 'original-articles', stage: 'review'}}
  router: route(':viewOptions', {
    transform: {
      viewOptions: {
        toState: routerParams.decode,
        toPath: routerParams.encode
      }
    }
  }),
  component: TracksTool
}
