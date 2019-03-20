// Track-specific config for a particular stage
// Features live here

import stageFeatures from 'all:part:@vega/stage-feature'

const trackStage = {
  title: 'Track stage',
  name: 'trackStage',
  type: 'object',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
      placeholder: '<stageName>_<trackName>',
      description:
        'Use something track- and stage-specific e.g. proofing_book-reviews',
      validation: Rule => Rule.required()
    },
    {
      title: 'Stage',
      name: 'stage',
      type: 'reference',
      to: [{type: 'stage'}],
      description: 'The canonical Stage as configured on this Track',
      validation: Rule => Rule.required()
    },
    {
      title: 'Editable by submitters?',
      name: 'isEditableBySubmitters',
      type: 'boolean',
      description: 'Is the Article editable by submitters at this Stage?'
    },
    {
      title: 'Review Enabled?',
      name: 'isReviewEnabled',
      type: 'boolean',
      description: 'Enable the review subsystem for this trackStage'
    },
    {
      title: 'May Be Published?',
      name: 'mayBePublished',
      type: 'boolean',
      description: 'Articles in this trackStage are ready for publication'
    }
  ]
}

if (stageFeatures.length > 0) {
  trackStage.fields.push({
    title: 'Features',
    name: 'features',
    type: 'array',
    of: [
      {
        type: 'reference',
        to: stageFeatures.map(stageFeature => ({
          type: stageFeature.config.name
        }))
      }
    ],
    description: 'List of active Features which augument this Stage'
  })
}

export default trackStage
