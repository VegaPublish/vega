import React from 'react'
import styles from './styles/EditReviewItem.css'
import {WithFormBuilderValue} from 'part:@lyra/form-builder'
import schema from 'part:@lyra/base/schema'
import lyraClient from 'part:@lyra/base/client'
import {distanceInWordsToNow} from 'date-fns'
import Button from 'part:@lyra/components/buttons/default'
import BlockContent from '@lyra/block-content-to-react'
import Field from './Field'
import Pointer from './Pointer'

type Props = {
  reviewer: any,
  reviewItem: any,
  readOnly: boolean,
  isCompleted: boolean
}

const serializers = {
  types: {
    pointer: Pointer
  }
}

class EditReviewItem extends React.Component<Props> {
  state = {focusPath: []}

  handleFocus = nextFocusPath => {
    this.setState({focusPath: nextFocusPath})
  }

  handleSubmit = () => {
    if (
      // eslint-disable-next-line no-alert
      window.confirm(
        'Submit will conclude this review. There is no undoing this. Go ahead?'
      )
    ) {
      lyraClient
        .patch(this.props.reviewItem._id)
        .set({completedAt: new Date().toISOString()})
        .commit()
    }
  }

  renderReviewContent(props) {
    const {readOnly} = this.props
    const {focusPath} = this.state
    if (!readOnly) {
      return (
        <Field
          fieldName="content"
          type={props.type}
          value={props.value}
          onChange={props.onChange}
          onFocus={this.handleFocus}
          focusPath={focusPath}
          readOnly={readOnly}
        />
      )
    }
    return (
      <div>
        <BlockContent
          blocks={props.value.content}
          serializers={serializers}
          className={styles.blockContent}
        />
      </div>
    )
  }

  render() {
    const {reviewItem, readOnly, isCompleted} = this.props
    const {focusPath} = this.state

    if (!reviewItem._id) {
      return (
        <div>
          No invite found. Are you sure you have been invited to review this
          article?
        </div>
      )
    }

    return (
      <div className={styles.root}>
        <WithFormBuilderValue
          documentId={reviewItem._id}
          typeName="reviewItem"
          schema={schema}
        >
          {props =>
            props.isLoading ? (
              'Loading…'
            ) : (
              <form onSubmit={e => e.preventDefault()} className={styles.form}>
                {this.renderReviewContent(props)}
                <br />
                {!readOnly &&
                  !isCompleted && (
                    <Field
                      fieldName="recommendation"
                      type={props.type}
                      value={props.value}
                      onChange={props.onChange}
                      onFocus={this.handleFocus}
                      focusPath={focusPath}
                      readOnly={readOnly}
                    />
                  )}
              </form>
            )
          }
        </WithFormBuilderValue>
        {isCompleted &&
          reviewItem.completedAt && (
            <span>
              Completed {distanceInWordsToNow(reviewItem.completedAt)} ago
            </span>
          )}
        {!isCompleted &&
          !readOnly && (
            <Button onClick={this.handleSubmit} color="primary">
              Submit
            </Button>
          )}
      </div>
    )
  }
}

export default EditReviewItem
