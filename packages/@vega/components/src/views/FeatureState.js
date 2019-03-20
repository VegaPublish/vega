// @flow
import React from 'react'
import stageFeatures from 'all:part:@vega/stage-feature'
import {get, debounce} from 'lodash'
import styles from './styles/FeatureState.css'
import schema from 'part:@lyra/base/schema'
import {checkout} from 'part:@lyra/form-builder'
import {PatchEvent} from 'part:@lyra/form-builder'
import {FormBuilderContext} from 'part:@lyra/form-builder'

import {
  getSummaryResolver,
  getFeatureStateId,
  getFeatureStateType
} from '../util/featureHelper'

function getProtoState(article, config) {
  return {
    _id: getFeatureStateId(article, config),
    _type: getFeatureStateType(config._type),
    article: {
      _type: 'reference',
      _ref: article._id
    },
    featureConfig: {
      _type: 'reference',
      _ref: config._id
    }
  }
}

export class FeatureState extends React.Component<*, *> {
  props: {
    featureConfig: any,
    article: any
  }

  state = {
    featureState: null,
    summary: null
  }
  featureStateDoc: any
  patchChannel = FormBuilderContext.createPatchChannel()

  componentDidMount() {
    this.checkout()
  }

  checkout() {
    const {featureConfig, article} = this.props
    this.featureStateDoc = checkout(getFeatureStateId(article, featureConfig))
    this.featureStateDoc.events.subscribe(event => {
      // Broadcast incoming patches to input components that applies patches on their own
      // Note: This is *experimental*
      this.patchChannel.receivePatches({
        patches: event.patches,
        snapshot: event.document
      })

      const featureState = event.document
      const getSummary = getSummaryResolver(featureConfig)
      this.setState({
        featureState: featureState,
        summary: getSummary(featureConfig, featureState)
      })
    })
  }

  handleChange = (event: PatchEvent) => {
    const {featureConfig, article} = this.props
    // todo: this is needed due to a Saga bug. When fixed: remove the if block, but keep the createIfNotExists
    if (!this.state.featureState) {
      this.featureStateDoc.createIfNotExists(
        getProtoState(article, featureConfig)
      )
    }
    this.featureStateDoc.patch(event.patches)
    this.commit()
  }

  commit = debounce(() => {
    this.featureStateDoc.commit().subscribe(v => {
      // console.log('saved')
    })
  }, 1000)

  getFeatureComponent() {
    const {featureConfig} = this.props
    const stageFeature = stageFeatures.find(
      sf => sf.config.name === featureConfig._type
    )
    return get(stageFeature, 'components.FullView')
  }

  render() {
    const {featureConfig, article} = this.props
    const {summary} = this.state
    const featureState =
      this.state.featureState || getProtoState(article, featureConfig)

    const FeatureComponent = this.getFeatureComponent()
    if (!FeatureComponent) {
      return <div>Feature component not found for {featureConfig._type}</div>
    }

    return (
      <div>
        <h1 className={styles.title}>{featureConfig.title}</h1>
        {summary &&
          summary.description && (
            <h2 className={styles.summary}>
              {`Status: ${summary.description}`}
            </h2>
          )}

        <FormBuilderContext
          schema={schema}
          value={featureState}
          patchChannel={this.patchChannel}
        >
          <FeatureComponent
            onChange={this.handleChange}
            featureConfig={featureConfig}
            featureState={featureState}
            article={article}
            type={schema.get(featureState._type)}
          />
        </FormBuilderContext>
      </div>
    )
  }
}
