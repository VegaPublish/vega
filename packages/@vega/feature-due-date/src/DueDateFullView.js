// @flow
import React from 'react'
import {distanceInWordsToNow, format} from 'date-fns'
import {get} from 'lodash'
import type {DueDateConfig, DueDateState} from './types'
import EditDateField from './EditDateField'

const preventDefault = event => event.preventDefault()

type Props = {
  type: Object,
  onChange: () => {},
  featureConfig: DueDateConfig,
  featureState: DueDateState
}

export default class DueDateFullView extends React.PureComponent<Props, *> {
  props: Props

  renderDate() {
    const {featureState} = this.props
    const dueDateString = get(featureState, 'dueAt')
    if (dueDateString) {
      return (
        <div>
          {format(new Date(dueDateString), 'D. MMMM YYYY')}
          {' ('}
          {distanceInWordsToNow(dueDateString)}
          {' ago)'}
        </div>
      )
    }
    return <div>No date set</div>
  }

  getFieldByName(name: string) {
    return this.props.type.fields.find(field => field.name === name)
  }

  render() {
    const {onChange, featureConfig, featureState} = this.props
    return (
      <div>
        <p>{featureConfig.description}</p>
        {this.renderDate()}
        <hr />
        <form onSubmit={preventDefault}>
          <EditDateField
            field={this.getFieldByName('dueAt')}
            value={featureState.dueAt}
            onChange={onChange}
          />
        </form>
      </div>
    )
  }
}
