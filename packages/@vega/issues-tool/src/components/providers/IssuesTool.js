// @flow
import React from 'react'
import styles from './styles/IssuesTool.css'

import IssuesList from './IssuesList'
import type {Issue as IssueType} from '../types'
import {withRouterHOC} from 'part:@vega/core/router'
import {combineLatest} from 'rxjs'
import {switchMap, map} from 'rxjs/operators'
import {currentVenue$} from 'part:@vega/datastores/venue'
import {withPropsStream} from 'react-props-stream'
import CommunicatorWrapper from 'part:@vega/communicator/wrapper?'

import lyraClient from 'part:@lyra/base/client'
import {get} from 'lodash'
import mergeViewOptions from '../../utils/mergeViewOptions'

type Props = {
  issues: IssueType[],
  router: {
    state: Object,
    navigate: (state: Object) => void
  }
}

type ViewOptions = {
  issue?: ?string,
  article?: ?string
}

function fetchIssues() {
  return lyraClient.observable.fetch(`
    *[_type == "issue" && !(_id in path("drafts.**"))]
      |order(coalesce(publishAt,'A') desc)
      |[0...1000] {
        _id,
        _type,
        volume,
        number,
        content,
        title,
        publishedAt,
        coverImage
      }
  `)
}

function loadProps(props$) {
  return props$.pipe(
    switchMap(props =>
      combineLatest([currentVenue$, fetchIssues()]).pipe(
        map(([venue, issues]) => ({
          ...props,
          issues,
          venue
        }))
      )
    )
  )
}

export default withRouterHOC(
  withPropsStream(
    loadProps,
    class IssuesTool extends React.Component<Props> {
      getViewOptions() {
        return get(this.props.router.state, 'viewOptions') || {}
      }

      getViewOption(name: string) {
        return this.getViewOptions()[name]
      }

      handleToggleIssue = issueId => {
        this.setViewOption('issue', issueId)
      }

      handleToggleArticle = articleId => {
        this.setViewOption('article', articleId)
      }

      setViewOption(name: 'article' | 'issue', value) {
        const {router} = this.props
        const newOptions: ViewOptions = {
          [name]: this.getViewOption(name) === value ? null : value
        }
        // changing the issue should blank out article
        if (name === 'issue' && this.getViewOption('article')) {
          newOptions.article = null
        }
        router.navigate(mergeViewOptions(router, newOptions))
      }

      render() {
        const {issues} = this.props
        const issueId = this.getViewOption('issue')
        const articleId = this.getViewOption('article')
        const content = (
          <div className={styles.issuesList}>
            <IssuesList
              issues={issues}
              openIssueId={issueId}
              onToggleArticle={this.handleToggleArticle}
              openArticleId={articleId}
              onToggleIssue={this.handleToggleIssue}
            />
          </div>
        )

        const subjectId = articleId ? articleId : issueId

        return subjectId ? (
          <CommunicatorWrapper
            subjectIds={[subjectId]}
            focusedCommentId={this.getViewOption('comment')}
          >
            {content}
          </CommunicatorWrapper>
        ) : (
          content
        )
      }
    }
  )
)
