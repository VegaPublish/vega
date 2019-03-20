import React from 'react'
import {route} from 'part:@vega/core/router'
import routerParams from '@vega/utils/routerParams'

import ReviewTool from './components/ReviewTool'

const icon = () => <span />

const isCreateReviewProcess = (intentName, params) =>
  intentName === 'create' && params.type === 'reviewProcess' && params.article

const isAcceptInvite = (intentName, params) => intentName === 'acceptInvite'

const isManageReviewProcess = (intentName, params) =>
  intentName === 'edit' && params.type === 'reviewProcess' && params.id

export default {
  name: 'review',
  title: 'Review',
  icon: icon,
  getIntentState(intentName, params) {
    if (intentName === 'showPointer') {
      return {
        viewOptions: {
          reviewProcess: params.id,
          action: 'manage',
          pointer: params.pointer
        }
      }
    }
    if (isManageReviewProcess(intentName, params)) {
      return {
        viewOptions: {
          reviewProcess: params.id,
          action: 'manage'
        }
      }
    }
    if (isCreateReviewProcess(intentName, params)) {
      return {
        viewOptions: {
          article: params.article,
          action: 'create'
        }
      }
    }
    if (isAcceptInvite(intentName, params)) {
      return {
        viewOptions: {
          inviteId: params.inviteId,
          action: 'acceptInvite'
        }
      }
    }
    return null
  },
  router: route(':viewOptions', {
    transform: {
      viewOptions: {
        toState: routerParams.decode,
        toPath: routerParams.encode
      }
    }
  }),
  component: ReviewTool
}
