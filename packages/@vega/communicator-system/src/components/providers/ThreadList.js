// @flow
import {map, switchMap, withLatestFrom} from 'rxjs/operators'
import {withPropsStream} from 'react-props-stream'
import {forSubjectIds} from '../../datastores/commentsStore'
import ThreadList from '../views/ThreadList'

const createThreadFromComment = comment => ({
  name: comment.threadId,
  comments: []
})

function groupByThread(comments) {
  return comments.reduce((acc, comment) => {
    if (!(comment.threadId in acc)) {
      acc[comment.threadId] = createThreadFromComment(comment)
    }
    const thread = acc[comment.threadId]
    thread.comments.push(comment)
    return acc
  }, {})
}

const createPropsStream = props$ =>
  props$.pipe(
    map(props => [props.subjectId]),
    switchMap(forSubjectIds),
    map(groupByThread),
    map(threads => ({threads: Object.values(threads)})),
    withLatestFrom(props$),
    map(([threads, props]) => {
      return {...threads, ...props}
    })
  )

export default withPropsStream(createPropsStream, ThreadList)
