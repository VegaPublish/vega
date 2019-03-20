// @flow
import React from 'react'
import {get} from 'lodash'
import {combineLatest, Observable, of as observableOf} from 'rxjs'
import {distinctUntilChanged, map, share, switchMap} from 'rxjs/operators'
import RequirePermission from './RequirePermission'
import {withPropsStream} from 'react-props-stream'
import styles from './styles/ArticleStageStatus.css'
import {observePaths} from 'part:@lyra/base/preview'
import {materializeFeatures} from 'part:@vega/core/datastores/feature'
import client from 'part:@lyra/base/client'
import {IntentLink} from 'part:@vega/core/router'
import StageDot from './StageDot'
import WithDocumentFields from './WithDocumentFields'
import Spinner from 'part:@lyra/components/loading/spinner'
import FeatureStatesTable from '../views/FeatureStatesTable'
import {getSummaryResolver} from '../util/featureHelper'

type Author = {
  name: string
}
type Reference = {
  _ref: string
}
type Stage = {
  _id?: string,
  _ref?: string,
  title: string
}
type TrackStage = {
  name: string,
  stage: Stage,
  features: Array<Reference>
}
type Block = {
  _type: 'block'
}
type Article = {
  _id: string,
  title: string,
  authors: Author[],
  abstract: Block[],
  isReadyToAdvance: boolean,
  trackStage: TrackStage,
  stage: Stage,
  track?: {
    trackStages: TrackStage[]
  }
}
type FeatureConfig = {
  _id: string,
  _type: string
}
type FeatureState = {
  _id: string,
  article: Reference,
  featureConfig: Reference
}
type FeatureWithState = {
  config: FeatureConfig,
  state: FeatureState
}

type Props = {
  article: Article,
  featuresWithState: FeatureWithState[]
}

const materializeTrackStages = article => {
  if (!article.track || !article.track._id) {
    // article is not in a track, so just ignore trackStages
    return observableOf(article)
  }
  const trackStages = (article.track || {}).trackStages || []
  return combineLatest(
    trackStages.map(ts =>
      observePaths(ts, ['stage._id', 'stage.title', 'stage.order'])
    )
  ).pipe(
    map(materializedTrackStages => ({
      ...article,
      currentTrackStage: materializedTrackStages.find(
        ts => ts.stage._id === article.stage._id
      ),
      track: {
        ...article.track,
        trackStages: materializedTrackStages
      }
    }))
  )
}

function loadProps(props$): Observable<Props> {
  const article$ = props$.pipe(
    map(props => props.article._id),
    distinctUntilChanged(),
    switchMap(articleId =>
      observePaths(articleId, [
        'isReadyToAdvance',
        'stage._id',
        'stage.title',
        'stage.order',
        'track._id',
        'track.trackStages'
      ])
    ),
    switchMap(materializeTrackStages),
    share()
  )

  const featuresWithState$ = article$.pipe(
    switchMap(article =>
      materializeFeatures(article._id, article.currentTrackStage.features)
    )
  )

  return combineLatest(article$, featuresWithState$).pipe(
    map(([article, featuresWithState]) => ({article, featuresWithState}))
  )
}

export default withPropsStream(
  loadProps,
  class ArticleStageStatus extends React.Component<*, *> {
    props: Props
    state = {
      isUpdating: false,
      showSpinner: false
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.state.isUpdating && !prevState.isUpdating) {
        this._scheduleSpinner()
      }
      if (prevState.isUpdating && !this.state.isUpdating) {
        this._cancelSpinner()
      }
    }

    _withUpdateState = promise => {
      this.setState({isUpdating: true})
      const clear = () => this.setState({isUpdating: false})
      promise.then(clear, clear)
    }

    _cancelSpinner = () => {
      clearTimeout(this._loadingTimer)
      this.setState({showSpinner: false})
    }

    _scheduleSpinner = () => {
      clearTimeout(this._loadingTimer)
      this._loadingTimer = setTimeout(() => {
        this.setState({showSpinner: true})
      }, 200)
    }

    handleToggleArticleReady = () => {
      const {article} = this.props
      this._withUpdateState(
        client
          .patch(article._id)
          .set({
            isReadyToAdvance: !article.isReadyToAdvance
          })
          .commit()
      )
    }

    handleAdvanceToNextStage = () => {
      const {article} = this.props
      const nextStage = inferNextTrackStage(article)
      if (nextStage) {
        this._withUpdateState(
          client
            .patch(article._id)
            .set({
              stage: {
                _ref: nextStage.stage._id,
                _type: 'reference'
              },
              isReadyToAdvance: false
            })
            .commit()
        )
      }
    }

    getAllSummaries() {
      const {featuresWithState} = this.props
      return (featuresWithState || [])
        .map(fws => {
          const resolve = getSummaryResolver(fws.config)
          if (!resolve) {
            // todo: figure out what do do with this and fix
            // eslint-disable-next-line
            console.error(
              'No feature summary resolver found for feature config with type: %s',
              fws.config._type
            )
            return null
          }
          return resolve(fws.config, fws.state)
        })
        .filter(Boolean)
    }

    render() {
      const {article, featuresWithState} = this.props
      const {showSpinner} = this.state

      if (!article) {
        return <div className={styles.loading}>Article not found</div>
      }

      if (!get(article, 'track._id')) {
        return (
          <div className={styles.root}>
            {!article.track && (
              <h4>This article has not been assigned a track</h4>
            )}
          </div>
        )
      }

      if (!get(article, 'stage._id')) {
        return (
          <div className={styles.root}>
            {!article.stage && (
              <h4>
                This article has not been assigned to a stage within its track
              </h4>
            )}
          </div>
        )
      }

      const allSummaries = this.getAllSummaries()
      const hasPendingTasks = allSummaries.some(
        summary => summary.status === 'pending'
      )

      const hasNextStage = !!inferNextTrackStage(article)

      return (
        <div className={styles.root}>
          {showSpinner && (
            <div className={styles.loading}>
              <Spinner message="Updating..." inline />
            </div>
          )}
          <div className={styles.header}>
            <div className={styles.stageColor}>
              <StageDot stage={article.stage} />
            </div>
            <div className={styles.stageTitle}>
              <div className={styles.stageLabelHelper}>Stage</div>
              <h2 className={styles.stageName}>
                {article.currentTrackStage && (
                  <WithDocumentFields
                    document={article.currentTrackStage.stage}
                    fields={['title']}
                  >
                    {stage => <span>{stage.title}</span>}
                  </WithDocumentFields>
                )}
                {!article.currentTrackStage && 'no stage'}
              </h2>
            </div>

            <RequirePermission action="update" subject={article}>
              {({permissionGranted}) =>
                permissionGranted && (
                  <div className={styles.stageStatus}>
                    <h3 className={styles.stageStatusText}>
                      {hasPendingTasks ? 'Pending tasks' : 'Ready'} [
                      <IntentLink
                        intent="state"
                        params={{
                          id: article._id,
                          type: 'article'
                        }}
                      >
                        All tasks
                      </IntentLink>
                      ]
                    </h3>
                    {!hasPendingTasks && hasNextStage && (
                      <a
                        onClick={this.handleAdvanceToNextStage}
                        className={styles.stageAdvanceLink}
                      >
                        Advance to next stage →
                      </a>
                    )}
                    {hasPendingTasks &&
                      article.isReadyToAdvance &&
                      hasNextStage && (
                        <a
                          onClick={this.handleAdvanceToNextStage}
                          className={styles.stageAdvanceLink}
                        >
                          Some tasks incomplete, but Editor says OK. Advance to
                          next stage →
                        </a>
                      )}{' '}
                    {hasPendingTasks &&
                      !article.isReadyToAdvance &&
                      hasNextStage && (
                        <div className={styles.stageAdvanceLinkDisabled}>
                          Complete tasks to advance
                        </div>
                      )}
                    {hasPendingTasks && !hasNextStage && (
                      <div className={styles.stageAdvanceLinkDisabled}>
                        All done when pending tasks are completed
                      </div>
                    )}
                    {!hasPendingTasks && !hasNextStage && (
                      <div className={styles.stageAdvanceLinkDisabled}>
                        All done!
                      </div>
                    )}
                  </div>
                )
              }
            </RequirePermission>
          </div>

          <RequirePermission action="update" subject={article}>
            {({permissionGranted}) =>
              permissionGranted && (
                <div className={styles.features}>
                  <FeatureStatesTable
                    article={article}
                    hasNextStage={hasNextStage}
                    trackStage={article.currentTrackStage}
                    featuresWithState={featuresWithState}
                    onToggleArticleReady={this.handleToggleArticleReady}
                  />
                </div>
              )
            }
          </RequirePermission>
        </div>
      )
    }
  }
)

function inferNextTrackStage(article: Article): ?TrackStage {
  // order trackStages according to ordering on the actual stages
  const articleTrackStages = get(article, 'track.trackStages', []).sort(
    (tsA, tsB) => tsA.stage.order - tsB.stage.order
  )

  const indexOfCurrentStage = articleTrackStages.findIndex(trs => {
    return trs.stage._id === article.stage._id
  })
  return indexOfCurrentStage < 0 ||
    indexOfCurrentStage >= articleTrackStages.length
    ? null
    : articleTrackStages[indexOfCurrentStage + 1]
}
