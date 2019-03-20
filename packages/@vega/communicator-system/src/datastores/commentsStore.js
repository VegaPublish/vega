// @flow
import lyraClient from 'part:@lyra/base/client'
import {defer, of as observableOf} from 'rxjs'
import {map, scan, concatMap} from 'rxjs/operators'

function commentConstraintsForSubjects(subjectIds) {
  const constraints = ['_type == "comment"']
  constraints.push('_id in path("*")')
  if (subjectIds && subjectIds.length > 0) {
    const idsString = subjectIds.map(id => `"${id}"`).join(',')
    constraints.push(`subject._ref in [${idsString}]`)
  }
  return constraints.join(' && ')
}

const recordToComment = record => ({
  _id: record.i,
  threadId: record.t,
  author: record.a,
  subject: record.s,
  _createdAt: record.c
})

function considerCommentEvent(comments, event) {
  if (event.transition === 'disappear') {
    return comments.filter(comment => comment._id !== event.documentId)
  } else if (event.transition === 'appear') {
    return comments.concat(event.result) // will be sorted later on
  } else if (event.type === 'mutation') {
    return comments.map(
      comment => (comment._id === event.documentId ? event.result : comment)
    )
  }
  // eslint-disable-next-line no-console
  console.warn('Unhandled event type: ', event.type)
  return comments
}

export function forSubjectIds(subjectIds: string[]) {
  const fetchInitial$ = defer(() =>
    lyraClient.observable
      .fetch(
        `*[${commentConstraintsForSubjects(subjectIds)}]{
      "i": _id, "t": threadId, "a": author,"s": subject, "c": _createdAt
    }[0..10000]`
      )
      .pipe(map(records => records.map(recordToComment)))
  )

  const events$ = defer(() =>
    lyraClient.listen(
      `*[${commentConstraintsForSubjects(subjectIds)}]`,
      {},
      {events: ['welcome', 'mutation'], includeResults: true}
    )
  )

  return events$.pipe(
    concatMap(
      event => (event.type === 'welcome' ? fetchInitial$ : observableOf(event))
    ),
    scan((comments, event) => considerCommentEvent(comments, event))
  )
}
