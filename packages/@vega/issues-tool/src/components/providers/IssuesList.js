// @flow
import React from 'react'
import styles from './styles/IssuesList.css'
import IssueListItem from './IssueListItem'

type Issue = Object

type Props = {
  issues: Array<Issue>,
  openIssueId: string,
  onToggleIssue: (issueId: string) => void,
  openArticleId: string,
  onToggleArticle: (articleId: string) => void
}

export default class IssuesList extends React.Component<Props> {
  render() {
    const {
      issues,
      openIssueId,
      openArticleId,
      onToggleIssue,
      onToggleArticle
    } = this.props

    if (!issues) {
      return null
    }

    return (
      <div className={styles.root}>
        <ul className={styles.list}>
          {issues.map(issue => (
            <li key={issue._id} className={styles.item}>
              <IssueListItem
                issue={issue}
                isOpen={openIssueId === issue._id}
                openArticleId={openArticleId}
                onToggle={onToggleIssue}
                onToggleArticle={onToggleArticle}
              />
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
