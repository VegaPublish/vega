module.exports = {
  input: {
    _key: 'R5FvMrjo',
    _type: 'block',
    children: [
      {
        _key: 'cZUQGmh4',
        _type: 'span',
        marks: [],
        text: 'A word of warning; '
      },
      {
        _key: 'toaiCqIK',
        _type: 'span',
        marks: ['someLinkId'],
        text: 'Lyra'
      },
      {
        _key: 'gaZingA',
        _type: 'span',
        marks: [],
        text: ' is addictive.'
      }
    ],
    markDefs: [
      {
        _type: 'link',
        _key: 'someLinkId',
        href: 'https://vegapublish.com/'
      }
    ],
    style: 'normal'
  },
  output:
    '<p>A word of warning; <a href="https://vegapublish.com/">Lyra</a> is addictive.</p>'
}
