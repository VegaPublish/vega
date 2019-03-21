// @flow
import React from 'react'
import {combineLatest} from 'rxjs'
import {map} from 'rxjs/operators'
import {capitalize} from 'lodash'
import {currentVenue$} from 'part:@vega/datastores/venue'
import {withPropsStream} from 'react-props-stream'
import {IntentLink} from 'part:@vega/core/router'
import styles from './styles/VenueConfigCheck.css'

// Load stages and render dots for each article that has a stage
const loadProps = props$ =>
  combineLatest(props$, currentVenue$).pipe(
    map(([props, currentVenue]) => ({
      ...props,
      currentVenue
    }))
  )

type Venue = {
  _id: string,
  isConfigured: boolean,
  title: string
}

type Props = {
  currentVenue: Venue,
  children: React.Node
}

function ConfigError(props) {
  return <div className={styles.root}>{props.children}</div>
}

function VenueConfigCheck(props: Props) {
  const {children, currentVenue} = props

  if (!currentVenue) {
    const venueName = capitalize(currentVenue.dataset)
    return __DEV__ ? (
      <div>
        <ConfigError>
          <h3 className={styles.heading}>Config error</h3>
          The venue <code>{venueName}</code> has not been set up.{' '}
          <IntentLink intent="edit" params={{id: 'venue', type: 'venue'}}>
            Click here to setup {venueName} for the first time
          </IntentLink>
        </ConfigError>
        {children()}
      </div>
    ) : (
      <div>
        No such venue: <code>{JSON.stringify(currentVenue, null, 2)}</code>
      </div>
    )
  }
  return children()
}

export default withPropsStream(loadProps, VenueConfigCheck)
