import PointerPreview from './previews/PointerPreview'

export default {
  title: 'Pointer',
  name: 'pointer',
  type: 'object',
  fields: [
    {
      title: 'Path',
      name: 'path',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      title: 'Document',
      name: 'document',
      type: 'reference',
      to: [
        {type: 'issue', title: 'Issue'},
        {type: 'article', title: 'Article'},
        {type: 'articleSnapshot', title: 'Article Snapshot'}
      ]
    }
  ],
  preview: {
    component: PointerPreview
  }
}
