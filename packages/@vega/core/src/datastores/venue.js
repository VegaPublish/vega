// Exposes the currently selected venue to any subscribers
import urlState from 'part:@vega/core/datastores/urlstate'
import lyraConfig from 'config:lyra'
import lyraClient from 'part:@lyra/base/client'
import {combineLatest, defer, timer} from 'rxjs'

import {
  distinctUntilChanged,
  filter,
  map,
  mergeMapTo,
  publishReplay,
  refCount,
  switchMap
} from 'rxjs/operators'

const CLIENTS = {}

function getDatasetClient(datasetName) {
  if (!CLIENTS[datasetName]) {
    CLIENTS[datasetName] = lyraClient.clone().config({dataset: datasetName})
  }
  return CLIENTS[datasetName]
}

const venueByDatasetName = name => {
  const client = getDatasetClient(name)
  const fetch$ = defer(() =>
    client.observable
      .fetch(`*[_id == $id]{...}`, {id: 'venue'})
      .pipe(map(venues => venues[0]))
  )
  return defer(() =>
    client
      .listen(
        `*[_id == $id]{...}`,
        {id: 'venue'},
        {events: ['welcome', 'mutation']}
      )
      .pipe(
        switchMap(ev =>
          ev.type === 'welcome' ? fetch$ : timer(1000).pipe(mergeMapTo(fetch$))
        )
      )
  )
}

export const allVenues$ = combineLatest(
  lyraConfig.venues.map(venueConfig =>
    venueByDatasetName(venueConfig.dataset).pipe(
      map(venueDocument => ({
        dataset: venueConfig.dataset,
        ...venueDocument
      }))
    )
  )
)

const venueIdFromUrl$ = urlState.pipe(
  filter(event => event.state),
  map(event => event.state.venue),
  distinctUntilChanged(),
  publishReplay(1),
  refCount()
)

export const currentVenue$ = venueIdFromUrl$.pipe(
  switchMap(datasetName =>
    venueByDatasetName(datasetName).pipe(
      map(venueDoc => ({
        dataset: datasetName,
        ...venueDoc
      }))
    )
  ),
  publishReplay(1),
  refCount()
)
