/* eslint-disable react/no-multi-comp*/
import React from 'react'
import Spinner from 'part:@lyra/components/loading/spinner'
import styles from './styles/IssuePublishStatus.css'

type Props = {
  publishStatus: any,
  lastPublishedAt: string
}

function renderChangedItems(items) {
  return (
    <ul>
      {items.map(item => (
        <li key={item._id}>
          {item.title} [{item._type}]
        </li>
      ))}
    </ul>
  )
}

function IssuePublishStatus(props: Props) {
  const {publishStatus, lastPublishedAt} = props
  if (!publishStatus) {
    return (
      <div className={styles.root}>
        Loading publish status ...
        <Spinner />
      </div>
    )
  }
  const {readyToPublish, unpublished} = publishStatus
  const relevantUnpublishedItems = unpublished.filter(item =>
    ['article', 'issue'].includes(item._type)
  )

  return (
    <div className={styles.root}>
      {relevantUnpublishedItems.length === 0 && <h3>Nothing new to publish</h3>}
      {relevantUnpublishedItems.length > 0 &&
        readyToPublish && <h3>This issue is ready to publish</h3>}
      {relevantUnpublishedItems.length > 0 &&
        !readyToPublish && <h3>Issue is not ready to publish</h3>}

      {relevantUnpublishedItems.length > 0 && (
        <div>
          <h4>
            {lastPublishedAt
              ? `Change${
                  relevantUnpublishedItems.length > 1 ? 's' : ''
                } since last publish:`
              : 'Slated for publication:'}
          </h4>
          {renderChangedItems(relevantUnpublishedItems)}
        </div>
      )}
    </div>
  )
}
export default IssuePublishStatus
