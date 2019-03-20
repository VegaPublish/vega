import FootnotePreview from './previews/FootnotePreview'

export default {
  title: 'Footnote Block Content',
  name: 'footnoteBlockContent',
  type: 'object',
  fields: [
    {
      title: 'Footnote',
      name: 'footnote',
      type: 'array',
      of: [
        {
          type: 'block',
          lists: [],
          styles: [],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'}
            ],
            annotations: []
          }
        }
      ]
    }
  ],
  preview: {
    component: FootnotePreview
  }
}
