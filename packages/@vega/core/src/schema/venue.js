// Journal, forum or other publication scene

export default {
  title: 'Venue',
  name: 'venue',
  type: 'document',
  liveEdit: true,
  hidden: true,
  singletons: [{id: 'venue', title: 'Venue'}],
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      title: 'Short description',
      name: 'shortDescription',
      type: 'text',
      options: {
        rows: 3
      }
    },
    {
      title: 'Long description',
      name: 'longDescription',
      type: 'text'
    },
    {
      title: 'Fields of interest',
      name: 'fieldsOfInterest',
      type: 'array',
      of: [{type: 'string'}]
    },
    {
      title: 'Home Page URL',
      name: 'homePageUrl',
      type: 'url',
      placeholder: 'www.journal-of-snah.org'
    },
    {
      title: 'Logo',
      name: 'logo',
      type: 'image'
    },
    {
      name: 'frontPageImage',
      title: 'Front page image',
      type: 'image'
    },
    {
      title: 'Contact Email',
      name: 'email',
      type: 'email',
      placeholder: 'post@journal-of-snah.org'
    },
    {
      title: 'Contact Phone',
      name: 'phone',
      type: 'string',
      placeholder: '+47 55512345'
    },
    {
      title: 'Editors',
      name: 'editors',
      type: 'array',
      of: [{type: 'reference', to: {type: 'user'}}]
    }
  ]
}
