// Stage is a part of Track; the path an article must navigate in order to get published

export default {
  title: 'Stage',
  name: 'stage',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      backgroundColor: 'displayColor'
    }
  },
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name',
      required: true
    },
    {
      name: 'title',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'order',
      type: 'number',
      title: 'Order',
      description:
        'This is the order of stages in the Development tab.'
    },
    {
      name: 'purpose',
      type: 'string',
      title: 'Purpose'
    },
    {
      name: 'displayColor',
      type: 'string',
      title: 'Display Color'
    }
  ],
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}]
    }
  ]
}
