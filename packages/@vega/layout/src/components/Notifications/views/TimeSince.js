// @flow
import distanceInWords from 'date-fns/distance_in_words'
import {withPropsStream} from 'react-props-stream'
import {interval, concat, of as observableOf} from 'rxjs'
import {share, switchMap, mapTo} from 'rxjs/operators'

const TICKS$ = interval(2000).pipe(share())

const loadProps = props$ => {
  return props$.pipe(
    switchMap(props => concat(observableOf(props), TICKS$.pipe(mapTo(props))))
  )
}

export default withPropsStream(loadProps, TimeSince)

type Props = {
  timestamp: Date | number | string,
  cmpTimestamp: Date | number | string,
  includeSeconds: boolean,
  addSuffix: boolean,
  updateInterval: 'seconds' | 'minutes'
}

function TimeSince(props: Props) {
  const {
    timestamp,
    cmpTimestamp = new Date(),
    includeSeconds,
    addSuffix
  } = props
  return distanceInWords(cmpTimestamp, timestamp, {
    includeSeconds,
    addSuffix
  })
}
