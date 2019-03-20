import {pick} from 'lodash'
import primitivePreview from '../preview/primitivePreview'

const OVERRIDABLE_FIELDS = [
  'jsonType',
  'type',
  'name',
  'title',
  'description',
  'options'
]

const DATETIME_CORE = {
  name: 'datetime',
  title: 'Datetime',
  type: null,
  jsonType: 'string'
}

export const DateTimeType = {
  get() {
    return DATETIME_CORE
  },
  extend(subTypeDef) {
    const parsed = Object.assign(
      pick(DATETIME_CORE, OVERRIDABLE_FIELDS),
      subTypeDef,
      {
        type: DATETIME_CORE,
        preview: primitivePreview
      }
    )
    return subtype(parsed)

    function subtype(parent) {
      return {
        get() {
          return parent
        },
        extend: extensionDef => {
          const current = Object.assign(
            {},
            parent,
            pick(extensionDef, OVERRIDABLE_FIELDS),
            {
              type: parent
            }
          )
          return subtype(current)
        }
      }
    }
  }
}
