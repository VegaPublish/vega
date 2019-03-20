// @flow
import {withPropsStream} from 'react-props-stream'
import {switchMap, map} from 'rxjs/operators'
import {observePaths} from 'part:@lyra/base/preview'
import Pointer from '../views/Pointer'

const loadProps = props$ =>
  props$.pipe(
    switchMap(incomingProps =>
      observePaths(incomingProps.node.document, ['_id', '_type']).pipe(
        map(materializedDocument => ({
          ...incomingProps,
          document: materializedDocument
        }))
      )
    )
  )

export default withPropsStream(loadProps, Pointer)
