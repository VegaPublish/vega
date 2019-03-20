import React from 'react'
import {omitBy, isNil} from 'lodash'
import {route} from 'part:@vega/core/router'
import ComposerProvider from './components/ComposerProvider'
import UUID from '@lyra/uuid'
import routerParams from '@vega/utils/routerParams'

const icon = () => <span />

const INTENT_NAMES = ['edit', 'create']
const ACCEPTED_TYPES = ['article', 'issue']

function canHandleIntent(intentName, params) {
  return (
    INTENT_NAMES.includes(intentName) && ACCEPTED_TYPES.includes(params.type)
  )
}

export default {
  name: 'composer',
  title: 'Composer',
  icon: icon,
  getIntentState(intentName, params) {
    if (canHandleIntent(intentName, params)) {
      return omitBy(
        {
          type: params.type,
          action: intentName,
          id: params.id || UUID(),
          params: {
            ...(params.focusPath && {
              focusPath: params.focusPath
            }),
            ...(params.comment && {
              comment: params.comment
            }),
            ...(params.pointer && {
              pointer: params.pointer
            })
          }
        },
        isNil
      )
    }
    return null
  },

  // journal-of-snah/composer/article/edit/article_id_123
  // journal-of-snah/composer/article/edit/article_id_123/focusPath=authors[_key="xyz"]
  // journal-of-snah/composer/article/edit/article_id_123/focusPath=authors[_key="xyz"];comment=wfiu382u4234
  router: route(
    '/:type/:action/:id',
    route(':params', {
      transform: {
        params: {
          toState: routerParams.decode,
          toPath: routerParams.encode
        }
      }
    })
  ),
  component: ComposerProvider
}
