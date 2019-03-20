import createSchema from 'part:@lyra/base/schema-creator'
import schemaTypes from 'all:part:@lyra/base/schema-type'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    /* Your types here! */
  ])
})
