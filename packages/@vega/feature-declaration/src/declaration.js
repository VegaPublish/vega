import DeclarationFullView from './DeclarationFullView'

export default {
  getSummary(featureConfig, featureState) {
    return {
      status: featureState && featureState.isDeclared ? 'satisfied' : 'pending',
      title: featureConfig.title,
      description: null
    }
  },

  components: {
    CompactView: DeclarationFullView,
    FullView: DeclarationFullView
  },

  config: {
    title: 'Declaration config',
    name: 'declarationConfig',
    type: 'document',
    preview: {
      select: {
        title: 'title'
      }
    },
    fields: [
      {
        title: 'Title',
        name: 'title',
        type: 'string',
        required: true,
        description: 'Title of the thing the user must declare to be so'
      },
      {
        title: 'Description',
        name: 'description',
        type: 'array',
        of: [{type: 'block'}]
      }
    ]
  },

  state: {
    title: 'Declaration state',
    name: 'declarationState',
    type: 'document',
    hidden: true,
    preview: {
      select: {
        title: 'article.title'
      },
      prepare: value => {
        return {title: `Declaration regarding ${value.title}`}
      }
    },
    fields: [
      {
        title: 'Article',
        name: 'article',
        type: 'reference',
        to: [{type: 'article'}]
      },
      {
        title: 'Feature configuration',
        name: 'featureConfig',
        type: 'reference',
        to: [{type: 'declarationConfig'}],
        description: 'Config which defines the scope of this feature'
      },
      {
        title: 'I solemnly declare',
        name: 'isDeclared',
        type: 'boolean'
      },
      {
        title: 'Declared at',
        name: 'declaredAt',
        type: 'datetime'
      },
      {
        title: 'Declared by',
        name: 'declaredBy',
        type: 'reference',
        to: [{type: 'user'}]
      }
    ]
  }
}
