import ArticleEditor from 'part:@vega/components/formfields/article-block-editor'
import MediaEmbedPreview from './previews/MediaEmbedPreview'

export default {
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  inputComponent: ArticleEditor,
  of: [
    {
      title: 'Block',
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'}
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Code', value: 'code'}
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
          title: 'Footnote',
          name: 'footnote',
          type: 'footnoteBlockContent'
        }
      ]
    },
    // {
    //   title: 'Code Block',
    //   name: 'code',
    //   type: 'code'
    // },
    // {
    //   title: 'Map Location',
    //   type: 'geopoint'
    // },
    {
      title: 'Media',
      type: 'object',
      fields: [
        {
          title: 'Media URL',
          name: 'url',
          type: 'url',
          description: 'Supports YouTube or Vimeo URLs'
        }
      ],
      preview: {
        select: {
          url: 'url'
        },
        component: MediaEmbedPreview
      }
    },
    {
      title: 'Image',
      type: 'image',
      preview: {
        select: {
          imageUrl: 'asset.url',
          title: 'caption'
        }
      },
      fields: [
        {
          title: 'Caption',
          name: 'caption',
          type: 'string',
          options: {
            isHighlighted: true
          }
        }
      ]
    }
  ]
}
