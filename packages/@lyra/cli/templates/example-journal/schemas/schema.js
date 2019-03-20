import createSchema from 'part:@lyra/base/schema-creator'
import stageFeatures from 'all:part:@vega/stage-feature'
import schemaTypes from 'all:part:@lyra/base/schema-type'

const featureConfigs = stageFeatures.map(stageFeature => stageFeature.config)
const featureStates = stageFeatures.map(stageFeature => stageFeature.state)

module.exports = createSchema({
  name: 'default',
  types: schemaTypes.concat(featureConfigs, featureStates).concat([
    /* Your types here! */
  ])
})
