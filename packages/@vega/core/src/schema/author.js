// Article author

export default {
  title: 'Author',
  name: 'author',
  type: 'object',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: Rule => Rule.required()
    },
    {
      name: 'affiliation',
      type: 'string',
      title: 'Affiliation'
    },
    {
      name: 'profileImage',
      title: 'Image',
      type: 'image',
      options: {hotspot: true}
    },
    {
      name: 'email',
      type: 'string',
      title: 'Email'
    },
    {
      name: 'country',
      type: 'string',
      title: 'Country'
    },
    {
      name: 'orcid',
      type: 'string',
      title: 'ORCID'
    }
  ]
}
