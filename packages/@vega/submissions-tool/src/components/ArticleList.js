import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles/ArticleList.css'
import {withPropsStream} from 'react-props-stream'
import {urlFor} from '@vega/utils/imageUrl'
import {currentUser$} from 'part:@vega/datastores/user'
import client from 'part:@lyra/base/client'
import {IntentLink} from 'part:@vega/core/router'
import humanize from 'humanize-list'
import {map, mergeMap} from 'rxjs/operators'

function renderByline(authors) {
  return authors
    ? `By ${humanize(authors.map(author => author.name))}`
    : authors
}

function loadProps(initialProps) {
  return currentUser$.pipe(
    mergeMap(currentUser => {
      return client.observable.fetch(
        `*[_type=='article' && !(_id in path('drafts.**')) && ${
          'references($user)'
          // Todo: remove the above line and replace it with the line below when the mongodb adapter supports a[]._ref queries
          // '$user in submitters[]._ref'
        }]{
          _id, title, authors, mainImage, track->{
            _id,name,title,trackStages[]{
              isReviewEnabled,isEditableBySubmitters,name,stage->{_id,title,order}
            }},
          stage->{_id,title,order}
        }`,
        {user: currentUser._id}
      )
    }),
    map(articles => {
      // order trackStages according to ordering on the actual stages
      articles.forEach(
        article =>
          (article.track.trackStages = article.track.trackStages.sort(
            (tsA, tsB) => tsA.stage.order - tsB.stage.order
          ))
      )
      return {articles}
    })
  )
}

function currentTrackStage(article) {
  return article.track.trackStages.find(
    ts => ts.stage._id === article.stage._id
  )
}

function renderStagesList(article) {
  const cts = currentTrackStage(article)
  if (!cts) {
    return ''
  }
  return article.track.trackStages.map((trackStage, index) => {
    const arrow =
      article.track.trackStages.length - 1 > index ? <span> ➔ </span> : null
    const isCurrent = cts.name === trackStage.name
    const stageStyle = isCurrent ? 'currentStage' : 'stage'
    const title = isCurrent ? 'Current Stage' : ''
    return (
      <span key={trackStage.stage._id}>
        <span className={styles[stageStyle]} title={title}>
          {trackStage.stage.title}
        </span>
        {arrow}
      </span>
    )
  })
}

export default withPropsStream(
  loadProps,
  class ArticleList extends React.Component {
    static propTypes = {
      articles: PropTypes.arrayOf(
        PropTypes.shape({
          _key: PropTypes.string,
          _ref: PropTypes.string
        })
      )
    }

    render() {
      const {articles} = this.props
      if (articles.length < 1) {
        return (
          <div className={styles.root}>
            {' '}
            <h2>Your articles</h2>
            None. Which means you've not been added to the submitters list of
            any articles.
          </div>
        )
      }

      return (
        <div className={styles.root}>
          <h2>Your articles</h2>
          <ul>
            {articles &&
              articles.map(article => (
                <li className={styles.articleContainer} key={article._id}>
                  <div className={styles.mainImageContainer}>
                    {article.mainImage && (
                      <img
                        src={urlFor(article.mainImage)}
                        className={styles.mainImage}
                      />
                    )}
                  </div>
                  <div className={styles.heading}>
                    <h3 className={styles.title}>{article.title}</h3>

                    {article.authors && article.authors.length > 0 && (
                      <p className={styles.headLineAuthors}>
                        {renderByline(article.authors)}
                      </p>
                    )}
                  </div>
                  <div className={styles.stageInfoContainer}>
                    <div>
                      <h4>Track</h4>{' '}
                      {article.track._id ? article.track.title : 'unassigned'}
                    </div>
                    <div>
                      <h4>Stage</h4>{' '}
                      {article.stage._id
                        ? renderStagesList(article)
                        : 'unassigned'}
                    </div>
                    <IntentLink
                      intent="edit"
                      params={{
                        id: article._id,
                        type: 'article'
                      }}
                    >
                      You can edit this article
                    </IntentLink>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )
    }
  }
)
