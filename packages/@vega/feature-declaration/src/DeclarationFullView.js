// @flow
import React from 'react'
import {distanceInWordsToNow} from 'date-fns'
import {get} from 'lodash'
import {observePaths} from 'part:@lyra/base/preview'
import {of as observableOf, combineLatest} from 'rxjs'
import {map, switchMap} from 'rxjs/operators'
import {withPropsStream} from 'react-props-stream'
import {currentUser$} from 'part:@vega/datastores/user'
import styles from './styles/DeclarationFullView.css'
import {FormBuilderInput} from 'part:@lyra/form-builder'
import PatchEvent, {set, unset} from 'part:@lyra/form-builder/patch-event'
import BlockContent from '@lyra/block-content-to-react'

import type {DeclarationConfig, DeclarationState} from './types'

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

type Props = {
  onChange: PatchEvent => void,
  featureConfig: DeclarationConfig,
  featureState: DeclarationState,
  type: Object,
  user: VegaUser,
  declarer: VegaUser
}

function loadProps(props$) {
  return props$.pipe(
    switchMap(props => {
      const {featureState} = props
      const declarer$ = featureState.declaredBy
        ? observePaths(featureState.declaredBy, ['_id', 'name'])
        : observableOf(null)
      return combineLatest([currentUser$, declarer$]).pipe(
        map(([user, declarer]) => ({
          ...props,
          user,
          declarer
        }))
      )
    })
  )
}

export default withPropsStream(
  loadProps,
  class DeclarationFullView extends React.Component<*, *> {
    props: Props

    handleCheck = () => {
      const {onChange, user} = this.props
      const now = new Date()

      const declaredBy = {
        _type: 'reference',
        _ref: user._id
      }
      onChange(
        PatchEvent.from(
          set(true, ['isDeclared']),
          set(declaredBy, ['declaredBy']),
          set(now.toISOString(), ['declaredAt'])
        )
      )
    }

    handleUncheck = () => {
      const {onChange} = this.props
      onChange(
        PatchEvent.from(
          set(false, ['isDeclared']),
          unset(['declaredBy']),
          unset(['declaredAt'])
        )
      )
    }

    handleCheckboxChange = patchEvent => {
      return patchEvent.patches[0].value === true
        ? this.handleCheck()
        : this.handleUncheck()
    }

    getFieldByName(name: string) {
      return this.props.type.fields.find(field => field.name === name)
    }

    render() {
      const {featureConfig, featureState, declarer} = this.props
      const isDeclaredField = this.getFieldByName('isDeclared')
      featureState.isDeclared = Boolean(featureState.isDeclared) !== false

      return (
        <div>
          <label>
            <BlockContent blocks={featureConfig.description} />
            <FormBuilderInput
              type={isDeclaredField.type}
              value={featureState.isDeclared}
              onChange={this.handleCheckboxChange}
            />{' '}
            {featureState.isDeclared && declarer && (
              <div className={styles.completer}>
                Declared by {declarer.name}{' '}
                {distanceInWordsToNow(
                  new Date(get(featureState, 'declaredAt'))
                )}{' '}
                ago
              </div>
            )}
          </label>
        </div>
      )
    }
  }
)
