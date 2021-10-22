import icon from 'react-icons/lib/fa/file-text-o'

export const ABSTRACT_FIELD = {
  name: 'abstract',
  title: 'Abstract',
  type: 'abstractBlockContent'
}

export const CONTENT_FIELD = {
  name: 'content',
  title: 'Content',
  type: 'blockContent'
}

export const MAIN_IMAGE_FIELD = {
  name: 'mainImage',
  title: 'Main Image',
  type: 'image',
  options: {hotspot: true}
}

export const TITLE_FIELD = {
  name: 'title',
  title: 'Title',
  type: 'string',
  validation: Rule => Rule.required()
}

export default {
  title: 'Article',
  name: 'article',
  type: 'document',
  icon,
  fieldsets: [
    {name: 'metadata', title: 'Metadata', options: {collapsible: true}}
  ],
  liveEdit: true,
  fields: [
    TITLE_FIELD,
    ABSTRACT_FIELD,
    CONTENT_FIELD,
    MAIN_IMAGE_FIELD,
    {
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [{type: 'author'}]
    },
    {
      name: 'submitters',
      title: 'Submitters',
      type: 'array',
      of: [{type: 'reference', to: {type: 'user'}}],
      fieldset: 'metadata',
      options: {
        access: {
          edit: ['editor', 'admin']
        }
      }
    },
    {
      name: 'track',
      title: 'Track',
      type: 'reference',
      to: {type: 'track'},
      description: 'When changing Track, also change the Stage (below) if needed.',
      fieldset: 'metadata',
      validation: Rule => Rule.required(),
      options: {
        access: {
          edit: ['editor', 'admin']
        }
      }
    },
    {
      name: 'stage',
      title: 'Stage',
      type: 'reference',
      to: {type: 'stage'},
      fieldset: 'metadata',
      validation: Rule => Rule.required(),
      options: {
        access: {
          edit: ['editor', 'admin']
        }
      }
    },
    {
      name: 'isReadyToAdvance',
      title: 'Ready to advance',
      type: 'boolean',
      description: 'Is the article ready to advance to the next stage?',
      fieldset: 'metadata',
      options: {
        access: {
          edit: ['editor', 'admin']
        }
      }
    },
    {
      name: 'isRetracted',
      title: 'Retracted',
      type: 'boolean',
      fieldset: 'metadata',
      options: {
        access: {
          edit: ['editor', 'admin']
        }
      }
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage'
    }
  }
}
