import {of as observableOf} from 'rxjs'
import {mergeMap, tap, switchMap, map, delay} from 'rxjs/operators'
import lyraClient from 'part:@lyra/base/client'
import {get} from 'lodash'
import imageUrlBuilder from '@lyra/image-url'

let builder = null

function getBuilder() {
  builder = builder || imageUrlBuilder(lyraClient)
  return builder
}

function imgUrlFor(source) {
  return getBuilder().image(source)
}

const readyArticlesQuery =
  '*[_type == "article" && isReadyToAdvance == true] | order(_updatedAt desc) [0..10]'

export default {
  title: 'Ready to advance',
  requiredCapability: 'edit',

  notifications$: observableOf([]).pipe(
    mergeMap(() =>
      lyraClient.listen(
        readyArticlesQuery,
        {},
        {includeResults: false, events: ['welcome', 'mutation']}
      )
    ),
    switchMap(event => {
      return observableOf(1).pipe(
        event.type === 'welcome' ? tap() : delay(1000),
        mergeMap(() => lyraClient.observable.fetch(readyArticlesQuery))
      )
    }),
    map((articles = []) =>
      articles.map(article => {
        return {
          title: article.title,
          description: 'Article is ready to advance to the next stage',
          id: `feature-notifier_${article._id}`,
          subjectId: article._id,
          timestamp: new Date(article._updatedAt),
          imageUrl:
            article &&
            article.mainImage &&
            imgUrlFor(get(article, 'mainImage'))
              .width(100, 100)
              .fit('crop')
              .crop('entropy')
              .url(),
          intent: {name: 'edit', type: 'article', id: article._id},
          severity: 'major'
        }
      })
    )
  )
}
