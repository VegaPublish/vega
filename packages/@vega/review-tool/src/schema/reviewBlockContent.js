import ReviewContentBlockEditor from 'part:@vega/components/formfields/review-content-block-editor'

export default {
  title: 'Review Block Content',
  name: 'reviewBlockContent',
  inputComponent: ReviewContentBlockEditor,
  type: 'array',
  of: [
    {
      type: 'block',
      lists: [],
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'Quote', value: 'blockquote'}
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Underline', value: 'underline'}
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url'
              }
            ]
          }
        ]
      },
      of: [
        {
          type: 'pointer'
        }
      ]
    }
  ]
}
