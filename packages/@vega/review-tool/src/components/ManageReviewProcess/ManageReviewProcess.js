import React from 'react'
import {map, switchMap} from 'rxjs/operators'
import {combineLatest} from 'rxjs'
import lyraClient from 'part:@lyra/base/client'
import {withPropsStream} from 'react-props-stream'
import {observePaths} from 'part:@lyra/base/preview'
import ManageReviewItem from './ManageReviewItem'
import styles from './styles/ManageReviewProcess.css'
import Button from 'part:@lyra/components/buttons/default'
import Fieldset from 'part:@lyra/components/fieldsets/default'
import schema from 'part:@lyra/base/schema'
import {WithFormBuilderValue} from 'part:@lyra/form-builder'
import Field from '../Field'
import AddReviewItemDialog from './AddReviewItemDialog'
import observableWithQuery from '../../util/observableWithQuery'
import Spinner from 'part:@lyra/components/loading/spinner'

const noop = () => {}

const humanReadableDecission = {
  reject: 'Reject',
  publish: 'Publish',
  'publish-with-revisions': 'Publish with revisions'
}

function listenReviewItems(reviewProcessId) {
  const query = `*[_type == "reviewItem" && reviewProcess._ref == "${reviewProcessId}" && !(_id in path('drafts.**'))]
    |order(_createdAt asc)
    [0..100]
    {...,reviewer->{_id,name}}`
  return observableWithQuery(query)
}

function loadProps(props$) {
  return props$.pipe(
    switchMap(props =>
      combineLatest([
        observePaths(props.reviewProcess, ['_id', 'completedAt', 'decision']),
        listenReviewItems(props.reviewProcess._id)
      ]).pipe(
        map(([reviewProcess, reviewItems]) => ({
          ...props,
          reviewProcess,
          reviewItems
        }))
      )
    )
  )
}

type Props = {
  reviewProcess: any,
  reviewItems: any
}

class ManageReviewProcess extends React.PureComponent<Props, *> {
  state = {
    isAddingFinalDecision: false,
    isAddingReviewer: false,
    readOnly: false,
    loading: false
  }

  handleAddReviewerClick = () => {
    this.setState({isAddingReviewer: true})
  }

  handleAddReviewerDialogClose = event => {
    this.setState({isAddingReviewer: false})
  }

  handleProceedToggle = () => {
    const {isAddingFinalDecision} = this.state
    this.setState({isAddingFinalDecision: !isAddingFinalDecision})
  }

  handleToggleReadOnly = event => {
    this.setState({readOnly: event.target.checked})
  }

  handleSubmit = () => {
    if (
      // eslint-disable-next-line no-alert
      window.confirm(
        'Submit will conclude this review process. There is no undoing this. Go ahead?'
      )
    ) {
      this.setState({
        loading: true
      })
      lyraClient
        .patch(this.props.reviewProcess._id)
        .set({completedAt: new Date().toISOString()})
        .commit()
        .then(
          this.setState({
            isAddingFinalDecision: false,
            readOnly: true,
            loading: false
          })
        )
    }
  }

  handleFocus = nextFocusPath => {
    this.setState({focusPath: nextFocusPath})
  }

  render() {
    const {reviewProcess, reviewItems} = this.props
    const {completedAt, decision} = reviewProcess
    const {loading} = this.state

    // Check if review is comleted
    const isCompleted = !!completedAt && decision

    const {
      readOnly,
      isAddingReviewer,
      isAddingFinalDecision,
      focusPath
    } = this.state
    return (
      <div className={styles.root}>
        {isAddingReviewer && (
          <AddReviewItemDialog
            onClose={this.handleAddReviewerDialogClose}
            reviewProcess={reviewProcess}
          />
        )}
        <div className={styles.header}>
          <h2>Reviews</h2>
          {isCompleted && (
            <div className={styles[`decision_${decision}`]}>
              Decision:
              <h3 className={styles.status}>
                {humanReadableDecission[decision] || decision}
              </h3>
            </div>
          )}
        </div>

        <ul>
          {reviewItems.map(reviewItem => (
            <ManageReviewItem
              key={reviewItem._id}
              reviewItem={reviewItem}
              readOnly={readOnly}
              isCompleted={isCompleted}
            />
          ))}
        </ul>

        {!readOnly && !isCompleted && (
          <div>
            <Button onClick={this.handleAddReviewerClick}>
              + Invite reviewer
            </Button>
            {isAddingFinalDecision && (
              <div>
                <WithFormBuilderValue
                  documentId={reviewProcess._id}
                  typeName="reviewProcess"
                  schema={schema}
                >
                  {props =>
                    props.isLoading ? (
                      <Spinner message="Loading…" />
                    ) : (
                      <form onSubmit={this.handleProceedToggle}>
                        <Fieldset>
                          {loading && (
                            <Spinner message="Sending final decision" />
                          )}
                          <Field
                            fieldName="content"
                            type={props.type}
                            value={props.value}
                            onChange={props.onChange}
                            onFocus={this.handleFocus}
                            onBlur={noop}
                            focusPath={focusPath}
                          />
                          <br />
                          <Field
                            fieldName="decision"
                            type={props.type}
                            value={props.value}
                            onChange={props.onChange}
                            onFocus={this.handleFocus}
                            onBlur={noop}
                            focusPath={focusPath}
                          />
                          <br />
                          <Button color="primary" onClick={this.handleSubmit}>
                            Submit
                          </Button>
                          <Button onClick={this.handleProceedToggle}>
                            Cancel
                          </Button>
                        </Fieldset>
                      </form>
                    )
                  }
                </WithFormBuilderValue>
              </div>
            )}

            {!isAddingFinalDecision && (
              <div className={styles.finalDecision}>
                <Button
                  onClick={this.handleProceedToggle}
                  color="primary"
                  loading={loading}
                >
                  Proceed to final decision
                </Button>
              </div>
            )}
          </div>
        )}
        {isCompleted && (
          <div>
            <div className={styles.finalDecisionCompleted}>
              <h2>Final decision made: {humanReadableDecission[decision]}</h2>
            </div>
            <WithFormBuilderValue
              documentId={reviewProcess._id}
              typeName="reviewProcess"
              schema={schema}
            >
              {props =>
                props.isLoading ? (
                  <Spinner message="Loading…" />
                ) : (
                  <Field
                    fieldName="content"
                    type={props.type}
                    value={props.value}
                    onChange={props.onChange}
                    onFocus={this.handleFocus}
                    onBlur={noop}
                    readOnly
                    focusPath={focusPath}
                  />
                )
              }
            </WithFormBuilderValue>
          </div>
        )}
      </div>
    )
  }
}

export default withPropsStream(loadProps, ManageReviewProcess)
