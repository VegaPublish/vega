import React from 'react'
import {map, switchMap} from 'rxjs/operators'
import {combineLatest} from 'rxjs'
import TrashIcon from 'part:@lyra/base/trash-icon'
import Button from 'part:@lyra/components/buttons/default'
import lyraClient from 'part:@lyra/base/client'
import {observePaths} from 'part:@lyra/base/preview'
import {withPropsStream} from 'react-props-stream'
import EditReviewItem from '../EditReviewItem'
import styles from './styles/ManageReviewItem.css'
import InviteLinkForReviewer from './InviteLinkForReviewer'
import {currentUser$} from 'part:@vega/datastores/user'

const recommendationMapping = {
  publish: 'Publish',
  'publish-with-revisions': 'Publish with revisions',
  reject: 'Reject'
}

function inferStatus(reviewItem) {
  if (reviewItem.completedAt) {
    return `Verdict: ${recommendationMapping[reviewItem.recommendation] ||
      'unknown'}`
  }
  if (reviewItem.acceptState) {
    return `In progress…` //capitalize(reviewItem.acceptState)
  }
  return 'Review pending…'
}

function loadProps(props$) {
  const reviewer$ = props$.pipe(
    switchMap(props =>
      observePaths(props.reviewItem.reviewer, ['name', 'identity'])
    )
  )

  return combineLatest(props$, reviewer$, currentUser$).pipe(
    map(([props, reviewer, currentUser]) => ({
      ...props,
      readOnly: reviewer._id !== currentUser._id,
      reviewer,
      currentUser
    }))
  )
}

type Props = {
  reviewItem: any,
  reviewer: any,
  readOnly: boolean,
  isCompleted: boolean
}

type State = {
  isEditReviewerNameOpen: boolean
}

class ManageReviewItem extends React.PureComponent<Props, State> {
  state = {
    isExpanded: false
  }

  handleDelete = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Delete this review?')) {
      const {reviewItem} = this.props
      lyraClient.delete(reviewItem._id)
    }
  }

  handleToggleExpand = () => {
    const {isExpanded} = this.state
    this.setState({isExpanded: !isExpanded})
  }

  render() {
    const {reviewItem, reviewer, readOnly, isCompleted} = this.props
    const {isExpanded} = this.state
    const status = inferStatus(reviewItem)
    const hasAccepted = reviewer.identity
    return (
      <li className={styles.reviewItem}>
        <div className={styles.header}>
          <div className={styles.reviewerName}>Review by {reviewer.name}</div>
          <div className={styles.statusCollection}>
            <span className={hasAccepted ? styles.accepted : styles.pending}>
              Invitation {hasAccepted ? 'accepted' : 'pending'}
            </span>
            <span
              className={
                reviewItem.completedAt ? styles.accepted : styles.pending
              }
            >
              {status}
            </span>

            <Button
              kind="simple"
              color="danger"
              title="Delete"
              icon={TrashIcon}
              onClick={this.handleDelete}
            />
          </div>
        </div>
        {!isCompleted && <InviteLinkForReviewer reviewer={reviewer} />}
        {!readOnly && <TrashIcon onClick={this.handleDelete} />}
        <div className={styles.collapse} onClick={this.handleToggleExpand}>
          <div className={styles.collapsedPointer}>
            {isExpanded ? '▼' : '►'}
          </div>
          <div>View</div>
        </div>

        {isExpanded && (
          <EditReviewItem
            reviewItem={reviewItem}
            readOnly={readOnly}
            reviewer={reviewer}
            isCompleted={isCompleted}
          />
        )}
      </li>
    )
  }
}

export default withPropsStream(loadProps, ManageReviewItem)
