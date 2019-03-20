import bundledTypes from 'part:@lyra/base/bundled-types'
import {keyBy} from 'lodash'

const keyedTypes = keyBy(bundledTypes.types, 'name')

export default {
  name: 'test',
  types: [
    keyedTypes.geopoint,
    {
      name: 'myTestLocation',
      type: 'object',
      fields: [
        {
          name: 'location',
          type: 'geopoint',
          title: 'Location'
        }
      ]
    }
  ]
}
