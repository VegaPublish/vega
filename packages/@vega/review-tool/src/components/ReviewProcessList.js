// @flow
import React from 'react'
import {isEmpty} from 'lodash'
import {combineLatest} from 'rxjs'
import {filter, map, switchMap} from 'rxjs/operators'
import {distanceInWordsToNow} from 'date-fns'
import styles from './styles/ReviewProcessList.css'
import {withPropsStream} from 'react-props-stream'
import {currentUser$} from 'part:@vega/datastores/user'
import lyraClient from 'part:@lyra/base/client'
import {IntentLink} from 'part:@vega/core/router'
import ReviewProcess from './ReviewProcess'

const reviewItemQuery = userId => {
  return `*[_type == "reviewItem" && reviewer._ref == "${userId}"][0]{...}`
}

function loadProps() {
  const reviewProcesses$ = lyraClient.observable.fetch(
    `*[_type == "reviewProcess" && !(_id in path('drafts.**'))]|order(_createdAt desc)[0..1000]{
      ...,
      article->{_id,title},
      "reviewItems": *[_type=="reviewItem" && !(_id in path('drafts.**')) && references(^._id)]
    }`
  )

  const reviewItem$ = currentUser$.pipe(
    filter(Boolean),
    switchMap(user => lyraClient.observable.fetch(reviewItemQuery(user._id)))
  )

  return combineLatest([currentUser$, reviewProcesses$, reviewItem$]).pipe(
    map(([user, reviewProcesses, reviewItem]) => {
      return {
        user,
        reviewProcesses,
        reviewItem: isEmpty(reviewItem) ? null : reviewItem
      }
    })
  )
}

function processStartTime(reviewProcess) {
  return `${distanceInWordsToNow(new Date(reviewProcess._createdAt))} ago`
}

type Props = {
  user: any,
  reviewProcesses: any,
  reviewItem: any
}

class ReviewProcessList extends React.PureComponent<Props> {
  getCompletedProcesses() {
    return this.props.reviewProcesses.filter(
      reviewProcess => !!reviewProcess.completedAt
    )
  }

  getOngoingProcesses() {
    return this.props.reviewProcesses.filter(
      reviewProcess => !reviewProcess.completedAt
    )
  }

  render() {
    const {user, reviewItem} = this.props
    const ongoingProcesses = this.getOngoingProcesses()
    const completedProcesses = this.getCompletedProcesses()

    return (
      <div className={styles.root}>
        {reviewItem && (
          <ReviewProcess reviewProcessId={reviewItem.reviewProcess._ref} />
        )}
        {!reviewItem && (
          <div>
            <h2>Reviews</h2>
            <h4>Hello, {user.name}</h4>
            <table className={styles.reviewProcessTable}>
              <tbody>
                <caption>Ongoing</caption>
                <tr>
                  <th />
                  <th>Started</th>
                  <th>Invited</th>
                  <th>Accepted Reviews</th>
                  <th>Completed Reviews</th>
                  <th />
                </tr>
                {ongoingProcesses.map(reviewProcess => {
                  const reviewItems = reviewProcess.reviewItems || []
                  return (
                    <tr key={reviewProcess.article._id}>
                      <td>{reviewProcess.article.title}</td>
                      <td>{processStartTime(reviewProcess)}</td>
                      <td>{reviewItems.length}</td>
                      <td>
                        {
                          reviewItems.filter(
                            item => item.acceptState === 'accepted'
                          ).length
                        }
                      </td>
                      <td>
                        {reviewItems.filter(item => item.completedAt).length}
                      </td>
                      <td>
                        <IntentLink
                          intent="edit"
                          params={{
                            type: 'reviewProcess',
                            id: reviewProcess._id
                          }}
                        >
                          Open
                        </IntentLink>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tbody>
                <caption>Completed</caption>
                <tr>
                  <th />
                  <th>Completed</th>
                  <th>Invited</th>
                  <th>Final Decision</th>
                  <th>Completed Reviews</th>
                  <th />
                </tr>

                {completedProcesses.map(reviewProcess => {
                  const reviewItems = reviewProcess.reviewItems || []
                  return (
                    <tr key={reviewProcess.article._id}>
                      <td>{reviewProcess.article.title}</td>
                      <td>
                        {distanceInWordsToNow(
                          new Date(reviewProcess.completedAt)
                        )}{' '}
                        ago
                      </td>
                      <td>{reviewItems.length}</td>
                      <td>{reviewProcess.decision}</td>
                      <td>
                        {reviewItems.filter(item => item.recommendation).length}
                      </td>
                      <td>
                        <IntentLink
                          intent="edit"
                          params={{
                            type: 'reviewProcess',
                            id: reviewProcess._id
                          }}
                        >
                          Open
                        </IntentLink>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }
}

export default withPropsStream(loadProps, ReviewProcessList)
