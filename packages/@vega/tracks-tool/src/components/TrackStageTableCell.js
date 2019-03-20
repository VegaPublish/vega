import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/TracksArticlesTable.css'
import Dot from '@vega/components/Dot'

class TrackStageTableCell extends React.Component {
  static propTypes = {
    onUpdateSelection: PropTypes.func.isRequired,
    track: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    stage: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    articles: PropTypes.array,
    isActive: PropTypes.bool
  }

  handleCellClick = () => {
    const {track, stage} = this.props
    return this.props.onUpdateSelection({
      track: track._id,
      stage: stage._id
    })
  }

  render() {
    const {track, stage, articles, isActive} = this.props
    const isStageInTrack = track.trackStages.find(
      trackStage => trackStage.stage._id == stage._id
    )

    const colorStyle = {color: `${stage.displayColor}`}
    return (
      <td
        onClick={this.handleCellClick}
        style={colorStyle}
        className={`
          ${styles.cell}
          ${isActive ? styles.active : styles.inactive}
          ${isStageInTrack ? styles.stageIncluded : styles.stageNotIncluded}
        `}
      >
        <span className={styles.quantity}>
          {articles.length > 0 && articles.length}
        </span>

        <span className={styles.dots}>
          {articles.map((article, i) => {
            if (i < 5) {
              const dotKey = `dot-${article._id}`
              return (
                <Dot
                  key={dotKey}
                  dot={{
                    color: stage.displayColor,
                    label: stage.title,
                    title: article.title,
                    subtitle:
                      article.authors &&
                      article.authors.map(author => author.name).join(', ')
                  }}
                  className={styles.dot}
                />
              )
            }
            return false
          })}
        </span>

        {articles.length > 5 && (
          <span className={styles.extraItemsText}> +{articles.length - 5}</span>
        )}
      </td>
    )
  }
}

export default TrackStageTableCell
