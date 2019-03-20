import ChecklistFullView from './ChecklistFullView'

export default {
  getSummary(featureConfig, featureState) {
    const completedItems = featureConfig.items.filter(configItem =>
      ((featureState || {}).items || []).some(
        stateItem => stateItem.completedItemName === configItem.name
      )
    )

    return {
      status:
        completedItems.length === featureConfig.items.length
          ? 'satisfied'
          : 'pending',
      title: featureConfig.title,
      description: `${completedItems.length}/${featureConfig.items.length} done`
    }
  },

  components: {
    CompactView: ChecklistFullView,
    FullView: ChecklistFullView
  },

  config: {
    title: 'Checklist config',
    name: 'checklistConfig',
    type: 'document',
    fields: [
      {
        title: 'Title',
        name: 'title',
        type: 'string'
      },
      {
        title: 'Items',
        name: 'items',
        type: 'array',
        of: [
          {
            name: 'checklistItem',
            type: 'object',
            fields: [
              {
                title: 'Title',
                name: 'title',
                type: 'string',
                required: true,
                description: 'The thing in need of doing'
              },
              {
                title: 'Name',
                name: 'name',
                type: 'string',
                required: true,
                description:
                  'Formal handle for the thing in need of doing. ' +
                  'Changing this name will orphan existing data which belongs to this item.'
              }
            ]
          }
        ]
      }
    ]
  },
  state: {
    title: 'Checklist state',
    name: 'checklistState',
    type: 'document',
    hidden: true,
    preview: {
      select: {
        title: 'featureConfig.title',
        items: 'items',
        configItems: 'featureConfig.items'
      },
      prepare(selection) {
        const {title, items, configItems} = selection
        const completedItems = items.filter(item => {
          return !!item.completedAt
        })
        return {
          title: `${title} [${completedItems.length}/${
            (configItems || []).length
          }]`
        }
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
        to: [{type: 'checklistConfig'}],
        description: 'Config which defines the scope of any state data'
      },
      {
        name: 'items',
        type: 'array',
        of: [
          {
            title: 'Checklist Item result',
            name: 'checklistItemResult',
            type: 'object',
            fields: [
              {
                title: 'Completed Item Name',
                name: 'completedItemName',
                type: 'string'
              },
              {
                title: 'Completed At',
                name: 'completedAt',
                type: 'datetime'
              },
              {
                title: 'Completed By',
                name: 'completedBy',
                type: 'reference',
                to: [{type: 'user'}]
              }
            ]
          }
        ]
      }
    ]
  }
}
