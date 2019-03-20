/* eslint-disable react/jsx-no-bind, complexity */

import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles/TracksArticlesTable.css'
import Menu from 'part:@lyra/components/menus/default'
import ArrowDropDown from 'part:@lyra/base/arrow-drop-down'
import {filterArticles, stagesSuperset} from '../utils'
import TrackStageTableCell from './TrackStageTableCell'
import {Portal} from 'part:@lyra/components/utilities/portal'
import {Manager, Popper, Target} from 'react-popper'

function issueTitle(issue) {
  return [issue.year, issue.title].filter(Boolean).join(' - ')
}

class TracksArticlesTable extends React.Component {
  static propTypes = {
    onUpdateSelection: PropTypes.func.isRequired,
    currentTrackId: PropTypes.string,
    currentIssueId: PropTypes.string,
    currentStageId: PropTypes.string,
    articles: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string
      })
    ),
    issues: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        volume: PropTypes.string,
        number: PropTypes.number,
        year: PropTypes.number
      })
    ),
    tracks: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        title: PropTypes.string,
        trackStages: PropTypes.arrayOf(
          PropTypes.shape({
            stage: PropTypes.object
          })
        )
      })
    )
  }

  state = {
    rootMenuOpen: false
  }

  static defaultProps = {
    articles: [],
    issues: [],
    tracks: [],
    currentTrackId: null,
    currentIssueId: null,
    currentStageId: null
  }

  rootMenuItems() {
    const {issues} = this.props
    return [{title: 'All', key: 'all'}].concat(
      issues.map(issue => {
        return {
          title: issueTitle(issue),
          key: issue._id
        }
      })
    )
  }

  handleRootMenuAction = rootMenuItem => {
    const {onUpdateSelection} = this.props
    if (rootMenuItem.key === 'all') {
      onUpdateSelection({track: null, stage: null, issue: null})
    } else {
      onUpdateSelection({issue: rootMenuItem.key})
    }
    this.handleRootMenuClose()
  }

  handleRootMenuClose = () => {
    this.setState({rootMenuOpen: false})
  }

  handleRootMenuOpen = () => {
    this.setState({rootMenuOpen: true})
  }
  render() {
    const {
      issues,
      tracks,
      currentTrackId,
      currentIssueId,
      currentStageId,
      onUpdateSelection,
      articles
    } = this.props

    const stages = stagesSuperset(tracks)
    const selectedIssue = issues.find(issue => issue._id === currentIssueId)
    const rootMenuTitle = selectedIssue ? issueTitle(selectedIssue) : 'All'

    if (issues.length < 1 || tracks.length < 1) {
      return <div>No issues or tracks</div>
    }

    return (
      <table className={styles.root}>
        <thead className={styles.tableHead}>
          <tr>
            <th className={styles.rootCell}>
              <Manager>
                <Target>
                  <div onClick={this.handleRootMenuOpen}>
                    <span>{rootMenuTitle}</span>
                    <span className={styles.arrowDropDown}>
                      <ArrowDropDown />
                    </span>
                  </div>
                </Target>
                {this.state.rootMenuOpen && (
                  <Portal>
                    <Popper>
                      <Menu
                        items={this.rootMenuItems()}
                        onAction={this.handleRootMenuAction}
                        onClose={this.handleRootMenuClose}
                        onClickOutside={this.handleRootMenuClose}
                        isOpen
                      />
                    </Popper>
                  </Portal>
                )}
              </Manager>
            </th>
            {stages.map(stage => {
              const handleColumnClick = () => {
                const didChangeStage =
                  currentStageId !== stage._id ||
                  (currentStageId && currentTrackId)
                return onUpdateSelection({
                  stage: didChangeStage ? stage._id : null,
                  track: null
                })
              }
              const colorStyle = {color: `${stage.displayColor}`}
              return (
                <th
                  onClick={handleColumnClick}
                  key={stage._id}
                  style={colorStyle}
                  className={`
                    ${styles.stageHeader}
                    ${
                      currentStageId == stage._id && !currentTrackId
                        ? styles.active
                        : styles.inActive
                    }
                  `}
                >
                  <div className={styles.stageTitle}>{stage.title}</div>
                </th>
              )
            })}
          </tr>
        </thead>

        <tbody className={styles.tableBody}>
          {tracks.map(track => {
            const handleRowClick = () => {
              const didChangeTrack =
                currentTrackId !== track._id ||
                (currentTrackId && currentStageId)
              return onUpdateSelection({
                track: didChangeTrack ? track._id : null,
                stage: null
              })
            }
            return (
              <tr key={track._id} className={styles.trackRow}>
                <th
                  onClick={handleRowClick}
                  className={`
                    ${styles.trackHeader}
                    ${
                      currentTrackId == track._id && !currentStageId
                        ? styles.active
                        : styles.inActive
                    }
                  `}
                >
                  {track.title}
                </th>
                {stages.map(stage => {
                  const isActive =
                    (currentStageId == stage._id &&
                      currentTrackId == track._id) ||
                    (currentStageId == stage._id && !currentTrackId) ||
                    (currentTrackId == track._id && !currentStageId)

                  const filterOptions = {
                    track: track._id,
                    stage: stage._id,
                    issue: currentIssueId
                  }
                  const filteredArticles = filterArticles(
                    articles,
                    filterOptions
                  )
                  return (
                    <TrackStageTableCell
                      onUpdateSelection={this.props.onUpdateSelection}
                      key={`${track._id}_${stage._id}`}
                      track={track}
                      stage={stage}
                      articles={filteredArticles}
                      isActive={isActive}
                    />
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}

export default TracksArticlesTable

/* eslint-enable react/jsx-no-bind, complexity */
