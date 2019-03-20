import Schema from '@lyra/schema'

export default Schema.compile({
  name: 'myBlog',
  types: [
    {
      type: 'object',
      name: 'blogPost',
      fields: [
        {
          title: 'Body',
          name: 'body',
          type: 'array',
          of: [{type: 'block'}]
        }
      ]
    }
  ]
})
