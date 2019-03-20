// @flow
import React from 'react'
import {Observable, of as observableOf} from 'rxjs'
import {switchMap, map, merge} from 'rxjs/operators'
import {withPropsStream} from 'react-props-stream'
import Spinner from 'part:@lyra/components/loading/spinner'
import {materializeFeatures} from 'part:@vega/core/datastores/feature'
import {FeatureState} from '../views/FeatureState'

type Author = {
  name: string
}

type Article = {
  _id: string,
  title: string,
  authors: Author[]
}

type Props = {
  article: Article,
  featuresWithState: any,
  isLoading: boolean
}

function loadProps(props$): Observable<Props> {
  return observableOf({isLoading: true}).pipe(
    merge(
      props$.pipe(
        switchMap(props => {
          const {article, featureConfig} = props
          return materializeFeatures(article._id, [featureConfig]).pipe(
            map(featuresWithState => ({
              ...props,
              featuresWithState
            }))
          )
        }),
        map(result => ({
          article: result.article,
          featuresWithState: result.featuresWithState,
          isLoading: false
        }))
      )
    )
  )
}

export default withPropsStream(
  loadProps,
  // eslint-disable-next-line react/prefer-stateless-function
  class FeatureStateProvider extends React.Component<*, *> {
    props: Props

    render() {
      const {article, featuresWithState, isLoading} = this.props

      if (isLoading) {
        return <Spinner center message="Loading…" />
      }
      return (
        <div>
          {featuresWithState.map(fws => {
            const config = fws.config
            return (
              <div key={config._id}>
                <hr />
                <FeatureState article={article} featureConfig={config} />
              </div>
            )
          })}
        </div>
      )
    }
  }
)
