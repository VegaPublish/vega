import moment from 'moment'
import DueDateFullView from './DueDateFullView'

export default {
  getSummary(featureConfig, featureState) {
    if (!featureState) {
      return {
        status: 'indifferent',
        title: featureConfig.title,
        description: 'Not set'
      }
    }
    const date = featureState.dueAt
    return {
      status: 'indifferent',
      title: featureConfig.title,
      description: `${moment(date).format('D. MMMM YYYY')} (${moment(
        date
      ).fromNow()})`
    }
  },

  components: {
    CompactView: DueDateFullView,
    FullView: DueDateFullView
  },

  config: {
    title: 'Due date config',
    name: 'dueDateConfig',
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
        required: true
      },
      {
        title: 'Description',
        name: 'description',
        type: 'string'
      }
    ]
  },

  state: {
    title: 'Due date state',
    name: 'dueDateState',
    type: 'document',
    hidden: true,
    preview: {
      select: {
        title: 'article.title'
      },
      prepare: value => {
        return {title: `Due Date regarding ${value.title}`}
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
        title: 'Due Date Configuration',
        name: 'featureConfig',
        type: 'reference',
        to: [{type: 'dueDateConfig'}],
        description: 'Config which defines how the due date behaves'
      },
      {
        title: 'Due date',
        name: 'dueAt',
        type: 'datetime',
        options: {
          inputTime: false
        }
      }
    ]
  }
}
