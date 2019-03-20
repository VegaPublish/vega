import {validateDocument} from '@lyra/validation'
import {withPropsStream} from 'react-props-stream'
import {combineLatest, of as observableOf} from 'rxjs'
import {debounceTime, map, switchMap, take} from 'rxjs/operators'

function connect(props$) {
  const value$ = props$.pipe(map(props => props.value))
  const schema$ = props$.pipe(
    map(props => props.schema),
    take(1)
  )

  const validationMarkers$ = combineLatest(schema$, value$).pipe(
    debounceTime(200),
    switchMap(([schema, value]) =>
      value ? validateDocument(value, schema) : observableOf([])
    )
  )

  return combineLatest(props$, validationMarkers$).pipe(
    map(([props, validationMarkers]) => ({...props, validationMarkers}))
  )
}

export default withPropsStream(connect, props =>
  props.children(props.validationMarkers)
)
