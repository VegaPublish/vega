// @flow
import React from 'react'
import styles from './styles/ReviewProcess.css'
import {withPropsStream} from 'react-props-stream'
import ArticleSnapshot from './ArticleSnapshot'
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators'
import {combineLatest} from 'rxjs'
import {debounce} from 'lodash'
import {observePaths} from 'part:@lyra/base/preview'
import {currentUser$} from 'part:@vega/datastores/user'
import {WithUserRoles} from './withUserRoles'
import ManageReviewProcess from './ManageReviewProcess'
import EditReviewItem from './EditReviewItem'
import observableWithQuery from '../util/observableWithQuery'

function getListenReviewItemQuery(currentUserId) {
  return `*[_type == "reviewItem" && reviewer._ref == "${currentUserId}" && !(_id in path('drafts.**'))][0]
    {...,reviewer->{_id,name},reviewProcess->{_id}}`
}

function loadProps(props$) {
  const reviewProcessId$ = props$.pipe(
    map(props => props.reviewProcessId),
    distinctUntilChanged()
  )

  const reviewProcess$ = reviewProcessId$.pipe(
    switchMap(reviewProcessId =>
      observePaths({_id: reviewProcessId}, [
        'completedAt',
        'article._id',
        'articleSnapshot.title',
        'articleSnapshot.abstract',
        'articleSnapshot.content'
      ])
    )
  )

  const reviewItem$ = currentUser$.pipe(
    switchMap(currentUser =>
      observableWithQuery(getListenReviewItemQuery(currentUser._id))
    )
  )

  return combineLatest(currentUser$, reviewProcess$, reviewItem$, props$).pipe(
    map(([currentUser, reviewProcess, reviewItem, props]) => {
      const matchingReviewItem =
        reviewProcess._id === reviewItem.reviewProcess._id ? reviewItem : null
      return {
        currentUser,
        reviewProcess,
        reviewItem: matchingReviewItem,
        highlightedPointerKey: props.highlightedPointerKey
      }
    })
  )
}

class ReviewProcess extends React.Component<*> {
  componentDidUpdate() {
    const {highlightedPointerKey} = this.props
    if (highlightedPointerKey) {
      this.scrollPointerIntoView(highlightedPointerKey)
    }
  }

  scrollPointerIntoView = debounce(highlightedPointerKey => {
    const elm = document.getElementById(highlightedPointerKey)
    if (elm) {
      window.requestAnimationFrame(() => {
        elm.scrollIntoView({behavior: 'smooth', block: 'center'})
      })
    }
  }, 100)

  renderRole = roles => {
    const {reviewProcess, currentUser, reviewItem} = this.props
    if (roles.includes('admin')) {
      return <ManageReviewProcess reviewProcess={reviewProcess} />
    }
    if (roles.includes('editor')) {
      return <ManageReviewProcess reviewProcess={reviewProcess} />
    }
    if (roles.includes('reviewer')) {
      return (
        <div>
          <EditReviewItem
            reviewItem={reviewItem}
            reviewer={currentUser}
            readOnly={Boolean(reviewItem.completedAt)}
          />
          {Boolean(reviewItem.completedAt) && (
            <div className={styles.thankYou}>
              <h2>Review completed</h2>
              <p>Thank you for the review.</p>
            </div>
          )}
        </div>
      )
    }
    return `Unknown role: ${roles}`
  }

  render() {
    const {reviewProcess, highlightedPointerKey} = this.props
    return (
      <div className={styles.root}>
        <div className={styles.leftPane}>
          <ArticleSnapshot
            snapshot={reviewProcess.articleSnapshot}
            highlightedPointerKey={highlightedPointerKey}
          />
        </div>
        <div className={styles.rightPane}>
          <WithUserRoles
            subjectType="article"
            subjectId={reviewProcess.article._id}
          >
            {this.renderRole}
          </WithUserRoles>
        </div>
      </div>
    )
  }
}

export default withPropsStream(loadProps, ReviewProcess)
