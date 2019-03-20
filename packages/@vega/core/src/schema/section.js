// Topical partition of an issue
import icon from 'react-icons/lib/fa/folder-open-o'

export default {
  title: 'Section',
  name: 'section',
  type: 'object',
  icon,
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'articles',
      title: 'Articles',
      type: 'array',
      of: [{type: 'reference', to: {type: 'article'}}]
    }
  ]
}
