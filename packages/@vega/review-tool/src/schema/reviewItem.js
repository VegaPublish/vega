// A ReviewItem holds reviewer acceptance state, verdictc, recommendation from a single reviewer

export default {
  title: 'Review Item',
  name: 'reviewItem',
  type: 'document',
  liveEdit: true,
  hidden: true,
  fields: [
    {
      title: 'Reviewer',
      name: 'reviewer',
      type: 'reference',
      description:
        'There should probably by a custom input component here wih UI for creating an invite link, but for now, just pick a Vega User',
      to: [{type: 'user'}]
    },
    {
      title: 'Review Process',
      name: 'reviewProcess',
      type: 'reference',
      description: 'The review effort which this reviewItem is member of',
      to: [{type: 'reviewProcess'}]
    },
    {
      title: 'Accept State',
      name: 'acceptState',
      type: 'string',
      description: 'Did the reviewer accept the job?',
      options: {
        layout: 'radio',
        list: [
          {title: 'Accepted', value: 'accepted'},
          {title: 'Rejected', value: 'rejected'},
          {title: 'Aborted', value: 'aborted'}
        ]
      }
    },
    {
      title: 'Content',
      name: 'content',
      type: 'reviewBlockContent',
      description: "Reviewer's opinion of the article"
    },
    {
      title: 'Recommendation',
      name: 'recommendation',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Publish', value: 'publish'},
          {title: 'Publish with Revisions', value: 'publish-with-revisions'},
          {title: 'Reject', value: 'reject'}
        ]
      }
    },
    {
      title: 'Completed At',
      name: 'completedAt',
      type: 'datetime'
    }
  ],
  preview: {
    select: {
      reviewer: 'reviewer.name',
      article: 'reviewProcess.article.title'
    },
    prepare(selection) {
      const {reviewer, article} = selection
      return {
        title: reviewer,
        subtitle: article
      }
    }
  }
}
