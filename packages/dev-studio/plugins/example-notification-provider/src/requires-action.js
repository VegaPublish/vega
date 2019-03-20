import {mergeMap, map, switchMap, concatMap} from 'rxjs/operators'
import {timer, NEVER} from 'rxjs'
import client from 'part:@lyra/base/client'
import {DEBUG} from './debug-helpers'

const BAD = 'CoffeeScript'
const REPLACEMENT = 'JavaScript'

const QUERY =
  '*[_type == "article" && title match $kw] {title, _id, _updatedAt}'
const PARAMS = {kw: BAD}

const fetchDocsWithBadWords = () => client.observable.fetch(QUERY, PARAMS)

const listener$ = timer(1000).pipe(
  concatMap(() =>
    client.observable.listen(
      '*[_type== "article"]',
      {},
      {
        events: ['welcome', 'mutation'],
        includeResult: false
      }
    )
  )
)

export default {
  onAction(action) {
    if (action.name === 'fix') {
      return client.observable
        .fetch(`*[_id == $id][0]{title, _id, _rev}`, {
          id: action.notification.data._id
        })
        .pipe(
          mergeMap(doc =>
            client.observable
              .patch(doc._id)
              .set({
                title: doc.title
                  .split(' ')
                  .map(word => (word === BAD ? REPLACEMENT : word))
                  .join(' ')
              })
              // .ifRevisionId(doc._rev)
              .commit()
          )
        )
        .subscribe()
    }
    throw new Error(`Unknown action: ${action.name}`)
  },
  title: 'Bad words!',
  notifications$: DEBUG
    ? listener$.pipe(
        switchMap(
          event =>
            event.type === 'welcome'
              ? fetchDocsWithBadWords()
              : timer(1000).pipe(concatMap(fetchDocsWithBadWords))
        ),
        map(results =>
          results.map(doc => ({
            title: `Document has the bad word "${BAD}" in its title`,
            id: doc._id,
            data: doc,
            description: `Remove "${BAD}" from the title of "${doc.title}"`,
            timestamp: new Date(doc._updatedAt),
            actions: ['fix'],
            intent: {
              name: 'edit',
              params: {
                type: 'article',
                id: doc._id
              }
            }
          }))
        )
      )
    : NEVER
}
