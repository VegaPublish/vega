import CommentBlockEditor from 'part:@vega/components/formfields/comment-block-editor'

export default {
  title: 'Comment',
  name: 'comment',
  type: 'document',
  fields: [
    {
      title: 'Author',
      name: 'author',
      type: 'reference',
      to: [{type: 'user'}]
    },
    {
      title: 'Subject',
      name: 'subject',
      type: 'reference',
      to: [{type: 'issue'}, {type: 'article'}]
    },
    {
      title: 'Thread',
      name: 'threadId',
      type: 'string',
      description:
        'A key shared between all comments in the same thread. Unique across all threads.'
    },
    {
      title: 'Message Body',
      name: 'body',
      inputComponent: CommentBlockEditor,
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
          },
          of: [
            {
              type: 'pointer'
            }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      id: '_id'
    },
    prepare(selection) {
      return {title: selection.id}
    }
  }
}
