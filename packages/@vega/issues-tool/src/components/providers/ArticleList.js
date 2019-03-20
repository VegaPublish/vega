// @flow
import React from 'react'
import styles from './styles/ArticleList.css'
import cx from 'classnames'
import type {Reference} from '../types'
import CompactArticle from '@vega/components/CompactArticle'

type Props = {
  articles: ?Array<Reference>,
  onToggleArticle: (articleId: string) => void,
  openArticleId: ?string
}

export default class ArticleList extends React.Component<Props> {
  render() {
    const {articles, onToggleArticle, openArticleId} = this.props

    return (
      <ul className={cx(openArticleId ? styles.listDimmed : styles.list)}>
        {(articles || []).map(article => {
          const isOpen = openArticleId === article._ref
          const isArticleSelected = isOpen || !openArticleId
          const isArticleDimmed = !isArticleSelected
          const itemClasses = cx(
            isArticleDimmed && styles.listItemDimmed,
            isOpen ? styles.listItemOpen : styles.listItemClosed
          )
          return (
            <li key={article._ref} className={itemClasses}>
              <CompactArticle
                article={article}
                isOpen={openArticleId === article._ref}
                onToggle={onToggleArticle}
              />
            </li>
          )
        })}
      </ul>
    )
  }
}
