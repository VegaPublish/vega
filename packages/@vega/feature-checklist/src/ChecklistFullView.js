// @flow
import React from 'react'
import {distanceInWordsToNow} from 'date-fns'
import {get} from 'lodash'
import Checkbox from 'part:@lyra/components/toggles/checkbox'
import lyraClient from 'part:@lyra/base/client'
import {of as observableOf, combineLatest} from 'rxjs'
import {switchMap, map} from 'rxjs/operators'
import {withPropsStream} from 'react-props-stream'
import {currentUser$} from 'part:@vega/datastores/user'
import styles from './styles/ChecklistFullView.css'
import {PatchEvent, patches} from 'part:@lyra/form-builder'
const {setIfMissing, insert, unset} = patches

import type {ChecklistFeatureConfig, ChecklistFeatureState} from './types'

type VegaUser = {
  _id: string,
  _type: 'user',
  name: string,
  email: string,
  externalId: string,
  externalProfileImageUrl?: string,
  profileImage?: {
    asset: {
      url: string
    }
  }
}

type InputProps = {
  onChange: PatchEvent => void,
  featureConfig: ChecklistFeatureConfig,
  featureState: ?ChecklistFeatureState,
  user: VegaUser,
  itemCompleters: Array<*>,
  type: Object
}

type OutputProps = InputProps & {
  user: VegaUser,
  itemCompleters: VegaUser[]
}

function loadProps(props$) {
  return props$.pipe(
    switchMap((props: InputProps) => {
      const items = (props.featureState || {}).items
      const userIds = items
        ? items.map(item => (item.completedBy || {})._ref).filter(Boolean)
        : null

      const completers$ = userIds
        ? lyraClient.observable.fetch(
            `*[_type == "user" && _id in ["${userIds.join('","')}"]]{_id,name}`
          )
        : observableOf([])

      return combineLatest([currentUser$, completers$]).pipe(
        map(([user, itemCompleters]) => ({...props, user, itemCompleters}))
      )
    })
  )
}

export default withPropsStream(
  loadProps,
  class ChecklistFullView extends React.Component<OutputProps> {
    handleCheck = checklistItem => {
      const {name} = checklistItem
      const {onChange, user} = this.props
      const now = new Date()
      const item = {
        _type: 'checklistItemResult',
        _key: name,
        completedItemName: name,
        completedAt: now.toISOString(),
        completedBy: {
          _type: 'reference',
          _ref: user._id
        }
      }
      onChange(
        PatchEvent.from(
          setIfMissing([], ['items']),
          insert([item], 'after', ['items', -1])
        )
      )
    }

    handleUncheck = checklistItem => {
      const {name} = checklistItem
      const {onChange} = this.props
      onChange(PatchEvent.from(unset(['items', {_key: name}])))
    }

    handleCheckboxChange = (event, checklistItem, checked) => {
      return checked
        ? this.handleUncheck(checklistItem)
        : this.handleCheck(checklistItem)
    }

    getCompleter = (checklistItem, checkedStateItem) => {
      const {itemCompleters} = this.props
      if (
        checkedStateItem &&
        checkedStateItem &&
        checkedStateItem.completedBy &&
        itemCompleters
      ) {
        const completer = itemCompleters.find(user => {
          return user._id === get(checkedStateItem, 'completedBy._ref')
        })
        return completer
      }
      return null
    }

    render() {
      const {featureConfig, featureState, user} = this.props
      const configuredItems = featureConfig.items || []

      if (!user) {
        return <div>Loading...</div>
      }

      return (
        <div className={styles.root}>
          <ul className={styles.list}>
            {configuredItems.map(checklistItem => {
              const checkedStateItem =
                featureState && featureState.items
                  ? featureState.items.find(
                      stateItem =>
                        checklistItem.name === stateItem.completedItemName
                    )
                  : null

              const checked = !!checkedStateItem
              const completer = this.getCompleter(
                checklistItem,
                checkedStateItem
              )
              const onCheckboxChange = event => {
                this.handleCheckboxChange(event, checklistItem, checked)
              }
              return (
                <li className={styles.item} key={checklistItem.name}>
                  <Checkbox
                    name={checklistItem.name}
                    checked={checked}
                    onChange={onCheckboxChange}
                    label={checklistItem.title}
                    description={
                      completer &&
                      `
                      Completed by ${completer.name}
                      ${distanceInWordsToNow(
                        new Date(get(checkedStateItem, 'completedAt'))
                      )}
                    `
                    }
                  />
                </li>
              )
            })}
          </ul>
        </div>
      )
    }
  }
)
