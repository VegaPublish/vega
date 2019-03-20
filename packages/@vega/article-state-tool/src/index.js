import React from 'react'
import ArticleStateTool from './components/ArticleStateTool'
import {route} from 'part:@vega/core/router'
import routerParams from '@vega/utils/routerParams'

const icon = () => <span />

const INTENT_NAMES = ['state']
const ACCEPTED_TYPES = ['article']

function canHandleIntent(intentName, params) {
  return (
    INTENT_NAMES.includes(intentName) && ACCEPTED_TYPES.includes(params.type)
  )
}

export default {
  name: 'articleState',
  title: 'Article State',
  icon: icon,
  getIntentState(intentName, params) {
    return canHandleIntent(intentName, params)
      ? {
          viewOptions: {
            [params.type]: params.id
          }
        }
      : null
  },

  // /journal-of-snah/articleState/article=article-id;user=user-id
  // will publish {tool: 'articleState', viewOptions: {article: 'articles-id', user: 'user-id'}}
  router: route(':viewOptions', {
    transform: {
      viewOptions: {
        toState: routerParams.decode,
        toPath: routerParams.encode
      }
    }
  }),
  component: ArticleStateTool
}
