// @flow
import React from 'react'
import {get, omitBy, isNil, flatten} from 'lodash'
import {combineLatest} from 'rxjs'
import {map} from 'rxjs/operators'
import Spinner from 'part:@lyra/components/loading/spinner'
import {withRouterHOC} from 'part:@vega/core/router'
import lyraClient from 'part:@lyra/base/client'
import {withPropsStream} from 'react-props-stream'
import {currentVenue$} from 'part:@vega/datastores/venue'
import styles from './styles/TracksTool.css'
import {filterArticles, stagesSuperset} from '../utils'
import TracksArticlesTable from './TracksArticlesTable'
import TracksList from './TracksList'
import CommunicatorWrapper from 'part:@vega/communicator/wrapper?'

function decorateArticlesWithIssues(articles, issues) {
  issues.forEach(issue => {
    const issueArticles = flatten(
      get(issue, 'content', []).map(section => get(section, 'articles', []))
    )
    issueArticles.forEach(issueArticle => {
      const article = articles.find(art => art._id === issueArticle._id)
      if (article) {
        article.issues.push(issue)
      }
    })
  })
  return articles
}

function loadProps(props$) {
  const articles$ = lyraClient.observable.fetch(
    `*[_type == "article" && !(_id in path('drafts.**'))][0...1000]{
          ...,
          mainImage{
            asset->{url}
          },
          track->{...},
          stage->{...},
          submitters[]->{
            ...,
            profileImage{
              asset->{url}
            }
          },
          "issues":
            *[_type == "issue" && references(^._id)]{
              _id,
              number,
              volume,
              title
            }
        }
      `
  )
  const issues$ = lyraClient.observable.fetch(
    `*[_type == "issue" && !(_id in path('drafts.**'))] | order(_createdAt desc)[0...200]{
          ...,
          content[]{
            ...,
            articles[] -> {
              _id,
              mainImage{
                asset->{url}
              },
              authors[]{
                ...,
                profileImage{
                  asset->{url}
                }
              }
            }
          }
        }
      `
  )
  const tracks$ = lyraClient.observable.fetch(
    `*[_type == "track" && !(_id in path('drafts.**'))][0...20]{
          ...,
          trackStages[]{
            ...,
            stage -> {...}
          },
          editors[] -> {...}
        }
      `
  )

  return combineLatest([
    articles$,
    issues$,
    tracks$,
    currentVenue$,
    props$
  ]).pipe(
    map(([articles, issues, tracks, venue, props]) => ({
      ...props,
      articles,
      issues,
      tracks,
      venue
    }))
  )
}

type Props = {
  router: Object, // eslint-disable-line react/forbid-prop-types
  venue: Object, // eslint-disable-line react/forbid-prop-types
  articles: Array<*>, // eslint-disable-line react/forbid-prop-types
  issues: Array<*>, // eslint-disable-line react/forbid-prop-types
  tracks: Array<*> // eslint-disable-line react/forbid-prop-types
}

export default withRouterHOC(
  withPropsStream(
    loadProps,
    class TracksTool extends React.Component<Props> {
      static defaultProps = {
        router: null,
        venue: null,
        articles: null,
        issues: null,
        tracks: null
      }

      handleUpdateSelection = (options = {}) => {
        const {router} = this.props
        const newViewOptions = omitBy(
          Object.assign({}, this.getViewOptions(), options),
          isNil
        )
        router.navigate({viewOptions: newViewOptions})
      }

      getViewOptions() {
        const {router} = this.props
        return get(router.state, 'viewOptions') || {}
      }

      inferSelectedStage = () => {
        const {tracks} = this.props
        const viewOptions = this.getViewOptions()
        return viewOptions.stage
          ? stagesSuperset(tracks).find(
              stage => stage._id === viewOptions.stage
            )
          : null
      }

      render() {
        const {articles, issues, tracks, venue} = this.props
        const viewOptions = this.getViewOptions()
        const currentStage = this.inferSelectedStage()

        if (!venue || !articles || !issues || !tracks) {
          return <Spinner message="Loading data…" center />
        }

        const decoratedArticles = decorateArticlesWithIssues(articles, issues)

        const filteredArticles = filterArticles(decoratedArticles, {
          ...viewOptions,
          article: null
        })

        const subjectIds = viewOptions.article
          ? [viewOptions.article]
          : filteredArticles.map(article => article._id)

        const content = (
          <div className={styles.root}>
            <TracksArticlesTable
              articles={articles}
              issues={issues}
              tracks={tracks}
              onUpdateSelection={this.handleUpdateSelection}
              currentStageId={viewOptions.stage}
              currentTrackId={viewOptions.track}
              currentIssueId={viewOptions.issue}
            />
            <TracksList
              articles={filteredArticles}
              venue={venue}
              currentStage={currentStage}
              currentArticleId={viewOptions.article}
              onUpdateSelection={this.handleUpdateSelection}
            />
          </div>
        )

        if (viewOptions.article) {
          return (
            <CommunicatorWrapper
              subjectIds={subjectIds}
              focusedCommentId={viewOptions.comment}
            >
              {content}
            </CommunicatorWrapper>
          )
        }

        return content
      }
    }
  )
)
