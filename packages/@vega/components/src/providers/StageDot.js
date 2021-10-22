import React from 'react'
import Dot from '../views/Dot'
import styles from './styles/StageDot.css'
import {map, distinctUntilChanged, switchMap} from 'rxjs/operators'
import {withPropsStream} from 'react-props-stream'
import {observePaths} from 'part:@lyra/base/preview'

const loadProps = props$ =>
  props$.pipe(
    map(props => props.stage),
    distinctUntilChanged(),
    switchMap(stage => observePaths(stage, ['displayColor', 'title'])),
    map(stage => {
      return {
        // original below with null value
        // dot: stage ? {label: stage.title, color: stage.displayColor} : null
        dot: stage ? {label: stage.title || 'No stage assigned', color: stage.displayColor || '#000'} : null
      }
    })
  )

export default withPropsStream(loadProps, props => {
  return props.dot ? <Dot className={styles.root} dot={props.dot} /> : null
})
