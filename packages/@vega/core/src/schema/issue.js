import icon from 'react-icons/lib/fa/tasks'

// A single edition published

export default {
  title: 'Issue',
  name: 'issue',
  type: 'document',
  icon,
  liveEdit: true,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      title: 'Image',
      name: 'coverImage',
      type: 'image',
      options: {hotspot: true}
    },
    {
      title: 'Issue number',
      name: 'number',
      type: 'number'
    },
    {
      title: 'Volume',
      name: 'volume',
      type: 'string'
    },
    {
      title: 'Year',
      name: 'year',
      type: 'number'
    },
    {
      title: 'Published at',
      name: 'publishedAt',
      type: 'datetime'
    },
    {
      title: 'Content',
      name: 'content',
      type: 'array',
      of: [{type: 'section'}]
    },
    {
      title: 'Editors',
      name: 'editors',
      type: 'array',
      of: [{type: 'reference', to: {type: 'user'}}]
    }
  ]
}
