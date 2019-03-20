import React from 'react'
import {omitBy, isNil} from 'lodash'
import {route} from 'part:@vega/core/router'
import routerParams from '@vega/utils/routerParams'
import lyraClient from 'part:@lyra/base/client'
import IssuesToolProvider from './components/providers/IssuesTool'
import UUID from '@lyra/uuid'

const icon = () => <span />

const INTENT_NAMES = ['show']
const ACCEPTED_TYPES = ['issue', 'article']

function fetchIssueIdForArticle(articleId) {
  const query = `*[_type == "issue" && references("${articleId}")][0]{_id}`
  return lyraClient.fetch(query).then(res => {
    return res._id
  })
}

function canHandleIntent(intentName, params) {
  return (
    INTENT_NAMES.includes(intentName) && ACCEPTED_TYPES.includes(params.type)
  )
}

export default {
  name: 'issues',
  title: 'Issues',
  icon: icon,
  getIntentState(intentName, params) {
    if (!canHandleIntent(intentName, params)) {
      return null
    }

    if (
      intentName === 'create' &&
      (params.type === 'issue' || params.type === 'article')
    ) {
      return {
        viewOptions: omitBy(
          {
            issue: params.type === 'issue' ? UUID() : null,
            article: params.type === 'article' ? UUID() : null,
            edit: true
          },
          isNil
        )
      }
    }

    if (params.type === 'issue') {
      return {
        viewOptions: {
          issue: params.id,
          edit: true
        }
      }
    }

    if (params.type === 'article' && intentName === 'edit') {
      return fetchIssueIdForArticle(params.id).then(issueId => {
        if (!issueId) {
          // This is the IssuesTool. Only handle articles with issues.
          return null
        }
        return {
          viewOptions: omitBy(
            {
              issue: issueId,
              article: params.id,
              edit: intentName === 'edit' ? true : null
            },
            isNil
          )
        }
      })
    }

    // anything below here can only do show
    if (intentName !== 'show') {
      return null
    }

    if (params.type === 'issue') {
      return {
        viewOptions: {
          issue: params.id
        }
      }
    }

    // venue
    return {viewOptions: {}}
  },

  // /journal-of-snah/issues/issue=abc123;article=def987
  // will publish {tool: 'issues', viewOptions: {issue: 'abc123', article: 'def987'}}
  router: route(':viewOptions', {
    transform: {
      viewOptions: {
        toState: routerParams.decode,
        toPath: routerParams.encode
      }
    }
  }),
  component: IssuesToolProvider
}
