// Exposes the currently selected venue to any subscribers
import {combineLatest} from 'rxjs'
import {debounceTime, mergeMap, map} from 'rxjs/operators'
import client from 'part:@lyra/base/client'

function getFeatureStateIdById(articleId, featureConfigId) {
  return `${articleId}-${featureConfigId}-state`
}

const quote = str => `"${str}"`

export function materializeFeatures(
  articleId: string,
  featureConfigRefs: Array<Reference>
) {
  const configIds = (featureConfigRefs || []).map(reference => reference._ref)
  const stateIds = configIds.map(configId =>
    getFeatureStateIdById(articleId, configId)
  )
  const configsQuery = `*[_id in [${configIds.map(quote).join(',')}]]`
  const statesQuery = `*[_id in [${stateIds.map(quote).join(',')}]]`

  return combineLatest(
    client
      .listen(
        configsQuery,
        {},
        {includeResults: false, events: ['welcome', 'mutation']}
      )
      .pipe(
        debounceTime(1000),
        mergeMap(() => client.observable.fetch(configsQuery))
      ),
    client
      .listen(
        statesQuery,
        {},
        {includeResults: false, events: ['welcome', 'mutation']}
      )
      .pipe(
        debounceTime(1000),
        mergeMap(() => client.observable.fetch(statesQuery))
      )
  ).pipe(
    map(([configs, states]) => {
      return (configs || []).map(config => ({
        config: config,
        state: states.find(state => state.featureConfig._ref === config._id)
      }))
    })
  )
}
