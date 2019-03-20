import {get} from 'lodash'
import stageFeatures from 'all:part:@vega/stage-feature'

function getStageFeature(featureConfig) {
  return stageFeatures.find(
    feature => feature.config.name === featureConfig._type
  )
}

export function getSummaryResolver(featureConfig) {
  const stageFeature = getStageFeature(featureConfig)
  return get(stageFeature, 'getSummary')
}

export function getFeatureStateIdById(articleId, featureConfigId) {
  return `${articleId}-${featureConfigId}-state`
}
export function getFeatureStateId(article, featureConfig) {
  return getFeatureStateIdById(article._id, featureConfig._id)
}
export function getFeatureStateType(featureConfigType) {
  return featureConfigType.replace(/Config$/, 'State')
}
