// @flow
import {withPropsStream} from 'react-props-stream'
import {map, switchMap} from 'rxjs/operators'
import Byline from '../views/Byline'
import {observePaths} from 'part:@lyra/base/preview'

const loadProps = props$ =>
  props$.pipe(
    switchMap(incomingProps =>
      observePaths(incomingProps.author, [
        'name',
        'profileImage',
        'externalProfileImageUrl'
      ]).pipe(
        map(materializedAuthor => ({
          ...incomingProps,
          author: materializedAuthor
        }))
      )
    )
  )

export default withPropsStream(loadProps, Byline)
