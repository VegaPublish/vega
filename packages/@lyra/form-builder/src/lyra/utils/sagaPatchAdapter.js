// @flow
import {arrayToJSONMatchPath} from '@lyra/mutator'
import assert from 'assert'
import {flatten} from 'lodash'
import type {Origin, Patch} from '../../typedefs/patch'
import * as convertPath from './convertPath'

type SagaPatch = Object

export function toSaga(patches: Patch[]): SagaPatch[] {
  return patches.map(toSagaPatch)
}

export function toFormBuilder(
  origin: Origin,
  patches: SagaPatch[]
): Patch[] {
  return flatten(patches.map(patch => toFormBuilderPatch(origin, patch)))
}

const notIn = values => value => !values.includes(value)

function toFormBuilderPatch(origin: Origin, patch: SagaPatch): Patch {
  return flatten(
    Object.keys(patch)
      .filter(notIn(['id', 'ifRevisionID', 'query']))
      .map(type => {
        if (type === 'unset') {
          return patch.unset.map(path => {
            return {
              type: 'unset',
              path: convertPath.toFormBuilder(path),
              origin
            }
          })
        }
        if (type === 'insert') {
          const position = 'before' in patch.insert ? 'before' : 'after'
          return {
            type: 'insert',
            position: position,
            path: convertPath.toFormBuilder(patch.insert[position]),
            items: patch.insert.items,
            origin
          }
        }
        return Object.keys(patch[type])
          .map(sagaPath => {
            if (type === 'set') {
              return {
                type: 'set',
                path: convertPath.toFormBuilder(sagaPath),
                value: patch[type][sagaPath],
                origin
              }
            }
            if (type === 'inc' || type === 'dec') {
              return {
                type: type,
                path: convertPath.toFormBuilder(sagaPath),
                value: patch[type][sagaPath],
                origin
              }
            }
            if (type === 'setIfMissing') {
              return {
                type: 'setIfMissing',
                path: convertPath.toFormBuilder(sagaPath),
                value: patch[type][sagaPath],
                origin
              }
            }
            if (type === 'diffMatchPatch') {
              return {
                type: 'diffMatchPatch',
                path: convertPath.toFormBuilder(sagaPath),
                value: patch[type][sagaPath],
                origin
              }
            }
            console.warn(new Error(`Unsupported patch type: ${type}`))
            return null
          })
          .filter(Boolean)
      })
  )
}

function toSagaPatch(patch: Patch): SagaPatch {
  const matchPath = arrayToJSONMatchPath(patch.path || [])
  if (patch.type === 'insert') {
    const {position, items} = patch
    return {
      insert: {
        [position]: matchPath,
        items: items
      }
    }
  }

  if (patch.type === 'unset') {
    return {
      unset: [matchPath]
    }
  }

  assert(patch.type, `Missing patch type in patch ${JSON.stringify(patch)}`)
  if (matchPath) {
    return {
      [patch.type]: {
        [matchPath]: patch.value
      }
    }
  }
  return {
    [patch.type]: patch.value
  }
}
