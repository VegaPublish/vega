import lyraClient from 'part:@lyra/base/client'

import {of as observableOf, concat} from 'rxjs'
import {scan, startWith, switchMap, withLatestFrom, map} from 'rxjs/operators'

import * as lyraPatchAdapter from '../util/lyraPatchAdapter'
import {Patcher} from '@lyra/mutator'

function applyPatches(document, patches) {
  const lyraPatches = lyraPatchAdapter
    .toLyra(patches)
    .map(patch => ({...patch, id: document._id}))

  return new Patcher(lyraPatches).apply(document)
}

const generateThreadId = () =>
  Math.random()
    .toString(32)
    .substring(2, 18)

export function createComment(comment) {
  // remove proforma id before creating
  const {_id, ...commentWithoutId} = comment
  return lyraClient.observable.create({
    ...commentWithoutId,
    threadId: comment.threadId || generateThreadId()
  })
}

export function updateComment(comment) {
  return lyraClient.observable
    .patch(comment._id)
    .set({body: comment.body})
    .commit()
}

export function withPatchesFrom(patches$) {
  return comment$ =>
    comment$.pipe(
      switchMap(protoComment =>
        concat(observableOf(protoComment), patches$).pipe(scan(applyPatches))
      ),
      withLatestFrom(patches$.pipe(startWith([]))),
      map(([snapshot, patches]) => ({snapshot, patches}))
    )
}
