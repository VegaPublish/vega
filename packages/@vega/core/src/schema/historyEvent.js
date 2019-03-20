// A historyEvent should be created whenever something worth logging happens.
// E.g. an Editor advances an Article to a new Stage. A new user signs up. An Acknowledgement is checked etc

export default {
  title: 'History event',
  name: 'historyEvent',
  type: 'object',
  fields: [
    {
      title: 'Description',
      name: 'description',
      type: 'string',
      descpription: 'What just happened, what is this event about'
    },
    {
      title: 'Article',
      name: 'article',
      type: 'reference',
      to: [{type: 'article'}]
    },
    {
      title: 'Event Occurred At',
      name: 'occuredAt',
      type: 'datetime'
    },
    {
      title: 'Triggered By',
      name: 'triggeredBy',
      type: 'reference',
      to: [{type: 'user'}]
    }
  ]
}
