import React from 'react'
import {combineLatest} from 'rxjs'
import {map, distinctUntilChanged, switchMap} from 'rxjs/operators'
import Dot from '@vega/components/Dot'
import {observePaths} from 'part:@lyra/base/preview'
import {withPropsStream} from 'react-props-stream'
import type {Article} from '../types'

// Load stages and render dots for each article that has a stage
const loadProps = props$ =>
  props$.pipe(
    map(props => props.articles),
    distinctUntilChanged(),
    switchMap(articles =>
      combineLatest(
        articles.map(article =>
          observePaths(article, [
            'title',
            'stage.displayColor',
            'stage.title',
            'authors'
          ])
        )
      )
    ),
    map(articlesWithStage =>
      articlesWithStage.filter(article => article.stage)
    ),
    map(articles => ({articles}))
  )

type Props = {
  articles: Article[]
}

function IssueDots(props: Props) {
  return (
    <span>
      {props.articles.map(article => {
        const dot = {
          color: article.stage.displayColor,
          label: article.stage.title,
          title: article.title,
          subtitle:
            article.authors &&
            article.authors.length > 0 &&
            article.authors.map(author => author.name).join(', ')
        }
        return <Dot key={article._id} dot={dot} />
      })}
    </span>
  )
}
export default withPropsStream(loadProps, IssueDots)
