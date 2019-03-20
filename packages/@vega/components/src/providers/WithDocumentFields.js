import {withPropsStream} from 'react-props-stream'
import {observePaths} from 'part:@lyra/base/preview'
import {switchMap, map} from 'rxjs/operators'

const loadProps = props$ =>
  props$.pipe(
    switchMap(props =>
      observePaths(props.document, props.fields).pipe(
        map(document => ({
          ...props,
          document
        }))
      )
    )
  )

export default withPropsStream(loadProps, props =>
  props.children(props.document)
)
