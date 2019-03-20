// @flow

import {map, switchMap} from 'rxjs/operators'
import {withPropsStream} from 'react-props-stream'
import {observePaths} from 'part:@lyra/base/preview'
import Comment from '../views/Comment'

const loadProps = props$ =>
  props$.pipe(
    switchMap(incomingProps =>
      observePaths(incomingProps.comment, [
        'body',
        'threadId',
        'author',
        '_updatedAt'
      ]).pipe(
        map(materializedComment => ({
          ...incomingProps,
          comment: materializedComment
        }))
      )
    )
  )

export default withPropsStream(loadProps, Comment)
