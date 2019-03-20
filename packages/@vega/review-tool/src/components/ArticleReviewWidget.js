// @flow
/* eslint-disable react/no-multi-comp */

import React from 'react'
import {map, switchMap} from 'rxjs/operators'
import {combineLatest} from 'rxjs'
import {format} from 'date-fns'
import lyraClient from 'part:@lyra/base/client'
import {withPropsStream} from 'react-props-stream'
import {observePaths} from 'part:@lyra/base/preview'
import {IntentLink} from 'part:@vega/core/router'
import IntentButton from '@vega/components/lib/views/IntentButton'
import RequireRole from '@vega/components/RequireRole'
import styles from './styles/ArticleReviewWidget.css'
const dateFormat = 'MMMM Do, YYYY'

function fetchReviewProcesses(articleId) {
  return lyraClient.observable.fetch(
    `*[_type == "reviewProcess" && references("${articleId}") && !(_id in path('drafts.**'))]|order(_createdAt asc)[0..100]{
    ...,
    "reviewItems": *[_type=="reviewItem" && !(_id in path('drafts.**')) && references(^._id)]
  }`
  )
}

function loadProps(props$) {
  return props$.pipe(
    switchMap(props =>
      combineLatest([
        observePaths(props.article, ['_id', 'title', 'track.trackStages']),
        fetchReviewProcesses(props.article._id)
      ]).pipe(
        map(([article, reviewProcesses]) => ({
          ...props,
          article,
          reviewProcesses
        }))
      )
    )
  )
}

function reviewLink(id, linkText) {
  return (
    <IntentLink intent="edit" params={{type: 'reviewProcess', id: id}}>
      {linkText}
    </IntentLink>
  )
}

function reviewProcessesListItem(reviewProcess) {
  if (reviewProcess.completedAt) {
    return (
      <div className={styles.reviewProcessesListItem}>
        <div>
          <div className={styles.reviewProcessesListItemDate}>
            {format(new Date(reviewProcess.completedAt), dateFormat)}:{' '}
          </div>
          <div className={styles.decision}>
            Decision: {reviewProcess.decision}
          </div>
        </div>
        <div>{reviewLink(reviewProcess._id, 'View')}</div>
      </div>
    )
  }
  const reviewItemCount = reviewProcess.reviewItems.length
  const acceptCount = reviewProcess.reviewItems.filter(
    rvi => rvi.acceptState === 'accepted'
  ).length
  const recommendationCount = reviewProcess.reviewItems.filter(
    rvi => rvi.recommendation
  ).length

  return (
    <div className={styles.reviewProcessesListItem}>
      <div>
        <div className={styles.reviewProcessesListItemDate}>
          {format(new Date(reviewProcess._createdAt), dateFormat)}
        </div>
        <div className={styles.decision}>Review started</div>
      </div>
      <div>Invitations: {reviewItemCount}</div>
      <div>Accepted: {acceptCount}</div>
      <div>Done: {recommendationCount}</div>
      <div>{reviewLink(reviewProcess._id, 'View')}</div>
    </div>
  )
}

function currentTrackStage(article) {
  return ((article.track || {}).trackStages || []).find(trackStage => {
    const trackStageId = trackStage.stage._id || trackStage.stage._ref
    const stageId = article.stage._id || article.stage._ref
    return trackStageId === stageId
  })
}

type Props = {
  article: any,
  reviewProcesses: any
}

class ArticleReviewWidget extends React.Component<Props> {
  render() {
    const {reviewProcesses, article} = this.props
    if (!article) {
      return null
    }

    const reviewEnabled = (currentTrackStage(article) || {}).isReviewEnabled
    if (reviewProcesses && reviewProcesses.length < 1 && !reviewEnabled) {
      return <div className={styles.root}>No review history</div>
    }
    const hasOngoingReview = reviewProcesses.some(rvp => !rvp.completedAt)
    return (
      <div className={styles.root}>
        {reviewProcesses.length > 0 && (
          <ul className={styles.reviewProcesses}>
            {reviewProcesses.map(rvp => (
              <li key={rvp._id} className={styles.reviewProcesses}>
                {reviewProcessesListItem(rvp)}
              </li>
            ))}
          </ul>
        )}

        <RequireRole
          qualifyingRoleNames={['admin', 'editor']}
          subject={article}
        >
          {({hasRole}) => {
            return (
              hasRole && (
                <div className={styles.createNewReview}>
                  {reviewEnabled && !hasOngoingReview && (
                    <IntentButton
                      intent="create"
                      params={{type: 'reviewProcess', article: article._id}}
                      color="primary"
                    >
                      Create new review
                    </IntentButton>
                  )}
                </div>
              )
            )
          }}
        </RequireRole>
      </div>
    )
  }
}

export default withPropsStream(loadProps, ArticleReviewWidget)
/* eslint-enable react/no-multi-comp */
