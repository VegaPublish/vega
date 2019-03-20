// @flow
import {withPropsStream, createEventHandler} from 'react-props-stream'
import {publishReplay, refCount, switchMap, map, mapTo} from 'rxjs/operators'
import {combineLatest, of as observableOf, merge} from 'rxjs'
import ReplyPlaceholderInput from '../views/ReplyPlaceholderInput'
import {observePaths} from 'part:@lyra/base/preview'
import {currentUser$} from 'part:@vega/datastores/user'

const [onEditorFocus$, onEditorFocus] = createEventHandler()
const currentFocused$ = merge(observableOf(null), onEditorFocus$).pipe(
  publishReplay(1),
  refCount()
)

const loadProps = props$ => {
  const [onClose$, onClose] = createEventHandler()

  const id = {}

  const isFocused$ = merge(
    currentFocused$.pipe(map(editorId => editorId === id)),
    onClose$.pipe(mapTo(false))
  )

  const author$ = currentUser$.pipe(
    switchMap(currentUser =>
      observePaths(currentUser, [
        'name',
        'profileImage',
        'externalProfileImageUrl'
      ])
    )
  )
  return combineLatest(author$, props$, isFocused$).pipe(
    map(([author, props, isFocused]) => ({
      ...props,
      author,
      isFocused,
      onFocus: () => onEditorFocus(id),
      onClose
    }))
  )
}
export default withPropsStream(loadProps, ReplyPlaceholderInput)
