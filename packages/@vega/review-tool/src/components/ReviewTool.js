// @flow
import React from 'react'
import ReviewProcessList from './ReviewProcessList'
import withViewOptions from './withViewOptions'
import CreateReviewProcess from './CreateReviewProcess'
import ReviewProcess from './ReviewProcess'
import styles from './styles/ReviewTool.css'

function inferAction(viewOptions) {
  if (viewOptions.action === 'create' && viewOptions.article) {
    return 'create'
  }
  if (viewOptions.action === 'manage' && viewOptions.reviewProcess) {
    return 'manage'
  }
  return viewOptions.action || 'list'
}

export default withViewOptions(
  class ReviewTool extends React.Component<*, *> {
    render() {
      const {viewOptions = {}} = this.props
      const action = inferAction(viewOptions)
      const highlightedPointerKey = viewOptions.pointer || null
      return (
        <div className={styles.root}>
          {action === 'create' && (
            <CreateReviewProcess articleId={viewOptions.article} />
          )}
          {action === 'manage' && (
            <ReviewProcess
              highlightedPointerKey={highlightedPointerKey}
              reviewProcessId={viewOptions.reviewProcess}
            />
          )}
          {action === 'list' && <ReviewProcessList />}
        </div>
      )
    }
  }
)
