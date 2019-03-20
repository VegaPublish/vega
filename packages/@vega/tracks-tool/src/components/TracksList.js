import PropTypes from 'prop-types'
import React from 'react'
import CompactArticle from '@vega/components/CompactArticle'
import {groupArticlesByTrack} from '../utils'
import CollectionWrapper from './CollectionWrapper'
import styles from './styles/TracksList.css'

function generateTitle(trackTitle, stageTitle) {
  return [trackTitle, stageTitle].filter(Boolean).join(' in ')
}

export default class TracksList extends React.Component {
  static propTypes = {
    onUpdateSelection: PropTypes.func.isRequired,
    articles: PropTypes.array,
    currentStage: PropTypes.object,
    currentArticleId: PropTypes.string
  }
  render() {
    const {
      articles,
      currentStage,
      currentArticleId,
      onUpdateSelection
    } = this.props
    const groupedArticles = groupArticlesByTrack(articles)

    return (
      <div className={styles.root}>
        {groupedArticles.map(group => {
          const isCollectionOpen =
            this.openCollection === group.track._id ||
            group.articles.some(article => article._id === currentArticleId)

          const handleCollectionClick = () => {
            this.openCollection = isCollectionOpen ? null : group.track._id
            return onUpdateSelection({article: null})
          }
          const isSelected = isCollectionOpen || !this.openCollection

          return (
            <CollectionWrapper
              key={group.track._id}
              title={generateTitle(
                group.track.title,
                (currentStage || {}).title
              )}
              qty={group.articles.length}
              isOpen={isCollectionOpen}
              isSelected={isSelected}
              onOpen={handleCollectionClick}
            >
              <ul className={styles.articleList}>
                {group.articles.map(article => {
                  const articleIsOpen = article._id === currentArticleId
                  const handleArticleClick = () => {
                    return onUpdateSelection({
                      article: articleIsOpen ? null : article._id
                    })
                  }
                  return (
                    <li
                      key={article._id}
                      className={`
                        ${
                          articleIsOpen
                            ? styles.articleListItemOpen
                            : styles.articleListItemClosed
                        }
                      `}
                    >
                      <CompactArticle
                        article={article}
                        isOpen={articleIsOpen}
                        onToggle={handleArticleClick}
                        showIssues
                      />
                    </li>
                  )
                })}
              </ul>
            </CollectionWrapper>
          )
        })}
      </div>
    )
  }
}
