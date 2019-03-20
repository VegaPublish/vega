// @flow
import React from 'react'
import styles from './styles/CreateReviewProcess.css'
import {withPropsStream} from 'react-props-stream'
import UUID from '@lyra/uuid'
import {observePaths} from 'part:@lyra/base/preview'
import Button from 'part:@lyra/components/buttons/default'
import lyraClient from 'part:@lyra/base/client'
import {
  distinctUntilChanged,
  take,
  map,
  tap,
  switchMap,
  share,
  mergeMap
} from 'rxjs/operators'
import {combineLatest} from 'rxjs'
import withNavigateIntent from './withNavigateIntent'

function makeSnapshotOf(article) {
  return observePaths(article, [
    'title',
    'mainImage',
    'abstract',
    'content'
  ]).pipe(
    take(1),
    map(srcArticle => ({
      _id: UUID(),
      _type: 'articleSnapshot',
      title: srcArticle.title,
      abstract: srcArticle.abstract,
      content: srcArticle.content
    }))
  )
}

function loadProps(props$) {
  const article$ = props$.pipe(
    map(props => props.articleId),
    distinctUntilChanged(),
    switchMap(articleId => observePaths({_id: articleId}, ['title']))
  )
  return combineLatest(props$, article$).pipe(
    map(([props, article]) => ({
      ...props,
      article
    }))
  )
}

class CreateReviewProcess extends React.Component<*, *> {
  state = {
    isCreating: false
  }

  handleCreate = () => {
    const {article, navigateIntent} = this.props

    const reviewProcessId = UUID()

    const snapshot$ = makeSnapshotOf(article).pipe(share())
    const reviewProcess$ = snapshot$.pipe(
      map(snapshot => ({
        _type: 'reviewProcess',
        _id: reviewProcessId,
        articleSnapshot: {
          _type: 'reference',
          _ref: snapshot._id
        },
        article: {
          _type: 'reference',
          _ref: article._id
        }
      }))
    )

    this.setState({isCreating: true})

    combineLatest(snapshot$, reviewProcess$)
      .pipe(
        mergeMap(([snapshot, reviewProcess]) =>
          lyraClient.observable
            .transaction()
            .create(snapshot)
            .create(reviewProcess)
            .commit()
        )
      )
      .pipe(
        tap(() => {
          navigateIntent('edit', {
            type: 'reviewProcess',
            id: reviewProcessId
          })
        })
      )
      .subscribe()
  }

  handleToggle = stateKey => {
    this.setState(prevState => ({[stateKey]: !prevState[stateKey]}))
  }

  render() {
    const {article} = this.props
    const {isCreating} = this.state
    return (
      <div className={styles.root}>
        <h2>
          Create new review for {'"'}
          <span className={styles.articleTitle}>{article.title}</span>
          {'"'}
        </h2>
        <Button
          loading={isCreating}
          type="button"
          color="primary"
          onClick={this.handleCreate}
          disabled={isCreating}
        >
          {isCreating ? 'Creating review…' : 'Create'}
        </Button>
      </div>
    )
  }
}

export default withNavigateIntent(
  withPropsStream(loadProps, CreateReviewProcess)
)
