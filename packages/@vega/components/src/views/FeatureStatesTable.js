// @flow
import React from 'react'
import EditIcon from 'part:@lyra/base/edit-icon'
import Button from 'part:@lyra/components/buttons/default'
import FullscreenDialog from 'part:@lyra/components/dialogs/fullscreen'
import {FeatureState} from './FeatureState'
import styles from './styles/FeatureStatesTable.css'
import {getSummaryResolver} from '../util/featureHelper'
import Checkbox from 'part:@lyra/components/toggles/checkbox'

type Reference = {
  _ref: string
}
type FeatureConfigT = {
  _id: string,
  _type: string,
  title: string
}
type FeatureStateT = {
  _id: string,
  article: Reference,
  featureConfig: Reference
}
type FeatureWithStateT = {
  config: FeatureConfigT,
  state: FeatureStateT
}
export default class FeatureStatesTable extends React.Component<*, *> {
  props: {
    article: any,
    hasNextStage: boolean,
    onToggleArticleReady: Function,
    featuresWithState: Array<FeatureWithStateT>
  }

  state = {
    openFeatureConfigId: null
  }

  handleOpenEdit = (featureConfigId: string) => {
    this.setState({
      openFeatureConfigId: featureConfigId
    })
  }

  handleCloseEdit = () => {
    this.setState({
      openFeatureConfigId: null
    })
  }

  handleToggleArticleReady = () => {
    this.props.onToggleArticleReady()
  }

  render() {
    const {article, featuresWithState, hasNextStage} = this.props
    if (!featuresWithState) {
      return <div>Loading...</div>
    }
    const {openFeatureConfigId} = this.state

    if (openFeatureConfigId) {
      const fws = featuresWithState.find(
        item => item.config._id === openFeatureConfigId
      )
      if (!fws) {
        throw new Error(
          `Expected to find an item with featureConfig._id == ${openFeatureConfigId}`
        )
      }
      return (
        <FullscreenDialog isOpen onClose={this.handleCloseEdit} centered>
          <FeatureState featureConfig={fws.config} article={article} />
        </FullscreenDialog>
      )
    }

    return (
      <table className={styles.root}>
        <thead className={styles.head}>
          <tr>
            <th>Checked</th>
            <th>Title</th>
            <th>Description</th>
            <th>Edit button</th>
          </tr>
        </thead>
        <tbody>
          {featuresWithState.map(featureWithState => {
            const getSummary = getSummaryResolver(featureWithState.config)

            const summary = getSummary(
              featureWithState.config,
              featureWithState.state
            )
            const needsAttention = summary.status === 'pending'
            const featureConfigId = featureWithState.config._id
            const handleOpenEdit = () => this.handleOpenEdit(featureConfigId)
            return (
              <tr
                className={styles.row}
                key={featureConfigId}
                onClick={handleOpenEdit}
              >
                <td className={styles.needsAttention}>
                  {needsAttention ? '✘' : ''}
                </td>
                <td className={styles.titleCell}>{summary.title}</td>
                <td className={styles.descriptionCell}>
                  {summary.description}
                </td>
                <td className={styles.functionsCell}>
                  <Button
                    icon={EditIcon}
                    title="Edit"
                    kind="simple"
                    onClick={handleOpenEdit}
                  />
                </td>
              </tr>
            )
          })}
          {hasNextStage && (
            <tr className={styles.row}>
              <td className={styles.needsAttention}>
                {article.isReadyToAdvance ? '' : '✘'}
              </td>
              <td className={styles.titleCell}>Ready to advance?</td>
              <td className={styles.descriptionCell}>
                Check this to notify editors that article is ready
              </td>
              <td className={styles.functionsCell}>
                <div className={styles.functions}>
                  <Checkbox
                    checked={article.isReadyToAdvance}
                    onChange={this.handleToggleArticleReady}
                    className={styles.advanceCheckbox}
                  >
                    Ready
                  </Checkbox>
                </div>
              </td>
            </tr>
          )}
          {!hasNextStage && (
            <tr>
              <td colSpan="4" className={styles.finalStageReachedCell}>
                Article has reached the final stage
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )
  }
}
