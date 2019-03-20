// The path an article must navigate in order to get published

export default {
  title: 'Track',
  name: 'track',
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
      required: true
    },
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Purpose',
      name: 'purpose',
      type: 'string'
    },
    {
      title: 'Track-specific Stages',
      name: 'trackStages',
      type: 'array',
      description:
        'Configure which stages are available on this track. Note: The order in which stages appear is not read from this array, but from the stage.order field.',
      of: [{type: 'trackStage'}]
    },
    {
      title: 'Editors',
      name: 'editors',
      type: 'array',
      of: [{type: 'reference', to: {type: 'user'}}]
    }
  ]
}
