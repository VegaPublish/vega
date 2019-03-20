import {timer} from 'rxjs'
import {switchMap} from 'rxjs/operators'
import lyraClient from 'part:@lyra/base/client'

export default query => {
  return lyraClient
    .listen(query, {}, {events: ['mutation', 'welcome'], includeResults: false})
    .pipe(
      switchMap(event => {
        if (event.type === 'welcome') {
          return lyraClient.observable.fetch(query)
        }
        return timer(1000).pipe(
          switchMap(() => lyraClient.observable.fetch(query))
        )
      })
    )
}
