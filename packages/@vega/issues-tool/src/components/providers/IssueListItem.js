// @flow
/* eslint-disable no-alert */
import React from 'react'
import moment from 'moment'
import {flatten} from 'lodash'
import styles from './styles/IssueListItem.css'
import {IntentLink} from 'part:@vega/core/router'
import AnimateHeight from 'react-animate-height'
import EditIcon from 'part:@lyra/base/edit-icon'
import Button from 'part:@lyra/components/buttons/default'
import RequirePermission from '@vega/components/RequirePermission'
import {
  fetchPublishStatus,
  publishIssue,
  unpublishIssue
} from 'part:@vega/datastores/issue'
import {withPropsStream} from 'react-props-stream'
import {combineLatest} from 'rxjs'
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  map,
  share,
  switchMap
} from 'rxjs/operators'
import lyraClient from 'part:@lyra/base/client'
import imageUrlBuilder from '@lyra/image-url'
import type {Reference} from '../types'
import IssuePublishStatus from './IssuePublishStatus'
import IssueDots from './IssueDots'
import ArticleList from './ArticleList'
import {observePaths} from 'part:@lyra/base/preview'

let builder = null

function getBuilder() {
  builder = builder || imageUrlBuilder(lyraClient)
  return builder
}

function urlFor(source) {
  return getBuilder().image(source)
}

function publishedWhen(issue) {
  const date = issue.publishedAt ? moment(issue.publishedAt) : null
  if (!date) {
    return 'Unpublished'
  }
  return `Published ${date.fromNow()}`
}

type Section = {
  title: string,
  articles: ?(Reference[])
}

type Content = Section[]

type Issue = {
  _id: string,
  title: string,
  volume: number,
  number: number,
  content: Content,
  publishedAt: string,
  coverImage: any
}

type Props = {
  isOpen: boolean,
  onToggle: (issueId: string) => void,
  onToggleArticle: (articleId: string) => void,
  openArticleId: string,
  publishStatus: any,
  issue: Issue,
  hidePublishStatus: boolean
}
const loadProps = props$ => {
  const issue$ = props$.pipe(
    map(props => props.issue._id),
    distinctUntilChanged(),
    switchMap(issueId =>
      observePaths({_id: issueId}, [
        '_id',
        'title',
        'volume',
        'number',
        'content',
        'publishedAt',
        'coverImage'
      ])
    ),
    share()
  )

  const publishStatus$ = issue$.pipe(
    distinctUntilKeyChanged('publishedAt'),
    switchMap(issue => fetchPublishStatus(issue._id))
  )
  return combineLatest(props$, issue$, publishStatus$).pipe(
    map(([props, issue, publishStatus]) => {
      if (publishStatus.error === 'Unauthorized') {
        return {...props, issue, publishStatus: null, hidePublishStatus: true}
      }
      return {...props, issue, publishStatus, hidePublishStatus: false}
    })
  )
}

class IssueListItem extends React.Component<Props> {
  _rootElement: ?HTMLDivElement

  state = {
    error: null,
    waitingForResponse: false
  }

  componentDidMount() {
    const {isOpen} = this.props
    if (isOpen && this._rootElement) {
      this._rootElement.scrollIntoView()
    }
  }

  setElement = (element: ?HTMLDivElement) => {
    this._rootElement = element
  }

  handleToggle = () => {
    const {issue, onToggle} = this.props
    onToggle(issue._id)
  }

  handlePublishIssue = () => {
    const {issue} = this.props
    if (
      window.confirm(`Do you really want to publish issue "${issue.title}"?`)
    ) {
      this.setState({waitingForResponse: true})
      publishIssue(issue._id)
        .then(result => {
          this.setState({waitingForResponse: false})
        })
        .catch(error => this.setState({error}))
    }
  }

  handleUnpublishIssue = () => {
    const {issue} = this.props
    if (
      window.confirm(`Do you really want to unpublish issue "${issue.title}"?`)
    ) {
      this.setState({waitingForResponse: true})
      unpublishIssue(issue._id)
        .then(result => {
          this.setState({waitingForResponse: false})
        })
        .catch(error => this.setState({error}))
    }
  }

  getAllArticles = (issue: Issue) => {
    return flatten(
      (issue.content || []).map(section => section.articles || [])
    ).filter(Boolean)
  }

  render() {
    const {
      issue,
      openArticleId,
      publishStatus,
      onToggleArticle,
      isOpen,
      hidePublishStatus
    } = this.props
    const {error, waitingForResponse} = this.state
    const content = issue.content || []
    const allArticles = this.getAllArticles(issue)
    const isReadyToPublish =
      (publishStatus || {}).readyToPublish &&
      (publishStatus || {}).unpublished.length > 0
    const imageUrl = urlFor(issue.coverImage)
      .size(150, 100)
      .fit('crop')
      .crop('entropy')
      .url()

    return (
      <div
        className={isOpen ? styles.isOpen : styles.isClosed}
        ref={this.setElement}
      >
        <div className={styles.header}>
          <div className={styles.headerData} onClick={this.handleToggle}>
            <div className={styles.imageContainer}>
              {issue.coverImage && (
                <img src={imageUrl} className={styles.image} />
              )}
              {!issue.coverImage && <div className={styles.imagePlaceholder} />}
            </div>
            <div className={styles.titleAndSubtitle}>
              <h4 className={styles.title}>
                {[issue.volume, issue.number].filter(Boolean).join('.')}{' '}
                {issue.title}
              </h4>
              <div className={styles.subTitle}>{publishedWhen(issue)}</div>
            </div>
          </div>

          <div className={styles.headerFunctions}>
            {!isOpen && (
              <div className={styles.dots}>
                <IssueDots articles={allArticles} />
              </div>
            )}

            {isOpen &&
              content.length && (
                <RequirePermission
                  action="update"
                  subject={{_type: 'venue', _id: 'venue'}}
                >
                  {({permissionGranted}) =>
                    permissionGranted && (
                      <div className={styles.issueActions}>
                        <Button
                          onClick={this.handlePublishIssue}
                          title="Publish this issue"
                          color="primary"
                          disabled={waitingForResponse || !isReadyToPublish}
                        >
                          Publish
                        </Button>
                        {issue.publishedAt && (
                          <Button
                            onClick={this.handleUnpublishIssue}
                            title="Unpublish this issue"
                            color="danger"
                            disabled={waitingForResponse}
                          >
                            Unpublish
                          </Button>
                        )}
                      </div>
                    )
                  }
                </RequirePermission>
              )}

            <RequirePermission action="update" subject={issue}>
              {({permissionGranted}) =>
                permissionGranted && (
                  <IntentLink
                    intent="edit"
                    params={{id: issue._id, type: 'issue'}}
                    className={styles.openIssueInEditorLink}
                    title="Edit"
                  >
                    <EditIcon />
                  </IntentLink>
                )
              }
            </RequirePermission>
          </div>
        </div>

        {isOpen &&
          !hidePublishStatus && (
            <IssuePublishStatus
              publishStatus={publishStatus}
              lastPublishedAt={issue.publishedAt}
            />
          )}

        {isOpen &&
          error && (
            <div>
              <h2>Got some errors</h2>
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </div>
          )}

        {isOpen &&
          !content.length && (
            <div className={styles.noSections}>No sections yet</div>
          )}

        <div className={styles.content}>
          <AnimateHeight
            height={isOpen && content && content.length > 0 ? 'auto' : 0}
            duration={200}
            className={styles.collapsable}
          >
            <div className={styles.collapsableContent}>
              <ul className={styles.sectionsList}>
                {content.map((section, index) => {
                  const sectionKey = `${issue._id}_${index}`
                  return (
                    <li key={sectionKey} className={styles.section}>
                      <h4
                        className={
                          openArticleId
                            ? styles.sectionTitleDimmed
                            : styles.sectionTitle
                        }
                      >
                        {section.title || 'Unknown title'}
                      </h4>
                      {isOpen &&
                        section.articles && (
                          <ArticleList
                            articles={section.articles}
                            openArticleId={openArticleId}
                            onToggleArticle={onToggleArticle}
                          />
                        )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </AnimateHeight>
        </div>
      </div>
    )
  }
}

export default withPropsStream(loadProps, IssueListItem)
