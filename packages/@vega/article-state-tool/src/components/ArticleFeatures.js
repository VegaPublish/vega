// @flow
import React from 'react'
import {get} from 'lodash'
import {combineLatest, of as observableOf} from 'rxjs'
import {switchMap} from 'rxjs/operators'
import FeatureStateProvider from '@vega/components/FeatureStateProvider'
import {observePaths} from 'part:@lyra/base/preview'
import {withPropsStream} from 'react-props-stream'
import WithDocumentFields from '@vega/components/lib/providers/WithDocumentFields'
import styles from './styles/ArticleFeatures.css'

// article.track.trackstages.configs
// for each config, render it with FeatureState(article, config)

type Author = {
  name: string
}

type Block = {
  _type: 'block'
}

type Article = {
  _id: string,
  title: string,
  authors: Author[],
  abstract: Block[],
  stage: any,
  track: any
}

type Props = {
  article: Article
}

const loadProps = props$ => {
  return props$.pipe(
    switchMap(incomingProps => {
      const article$ = observePaths({_id: incomingProps.articleId}, [
        'authors',
        'title',
        'stage._id',
        'stage.order',
        'track.trackStages'
      ])

      return article$.pipe(
        switchMap((article: Article) => {
          return combineLatest(
            get(article, 'track.trackStages', []).map(ts =>
              observePaths(ts, ['stage._id', 'stage.order'])
            )
          ).pipe(
            switchMap(trackStages => {
              return observableOf({
                ...incomingProps,
                article: Object.assign({}, article, {track: {trackStages}})
              })
            })
          )
        })
      )
    })
  )
}

export default withPropsStream(
  loadProps,
  // eslint-disable-next-line react/prefer-stateless-function
  class ArticleFeatures extends React.Component<*, *> {
    props: Props

    render() {
      const {article} = this.props
      if (!article) {
        return <div>Loading article...</div>
      }
      const {trackStages} = article.track
      if (!trackStages) {
        return <div>Loading article attributes...</div>
      }

      // order trackStages according to ordering on the actual stages
      const orderedTrackStages = get(article, 'track.trackStages', []).sort(
        (tsA, tsB) => tsA.stage.order - tsB.stage.order
      )

      return (
        <div>
          <h3 className={styles.title}>{article.title}</h3>

          {article.authors && article.authors.length > 0 && (
            <p className={styles.headLineAuthors}>
              By {article.authors.map(author => author.name).join(', ')}
            </p>
          )}

          {orderedTrackStages.map(trackStage => {
            const isCurrentStage = article.stage._ref == trackStage.stage._id
            const style = isCurrentStage
              ? styles.currentTrackStage
              : styles.trackStage
            const key = `${article.track._id}_${trackStage.stage._id}`
            return (
              <div key={key} className={`${styles.stage} ${style}`}>
                <WithDocumentFields
                  document={trackStage.stage}
                  fields={['title']}
                >
                  {stage => <h3>{stage.title}</h3>}
                </WithDocumentFields>

                {trackStage.features &&
                  trackStage.features.map(featureRef => {
                    return (
                      <FeatureStateProvider
                        key={featureRef._key}
                        article={article}
                        featureConfig={featureRef}
                      />
                    )
                  })}
              </div>
            )
          })}
        </div>
      )
    }
  }
)
