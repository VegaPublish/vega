module.exports = {
  input: {
    _type: 'block',
    children: [
      {
        _key: 'cZUQGmh4',
        _type: 'span',
        marks: ['abc'],
        text: 'A word of '
      },
      {
        _key: 'toaiCqIK',
        _type: 'span',
        marks: ['abc', 'em'],
        text: 'warning;'
      },
      {
        _key: 'gaZingA',
        _type: 'span',
        marks: [],
        text: ' Lyra is addictive.'
      }
    ],
    markDefs: []
  },
  output: '<p><span>A word of <em>warning;</em></span> Lyra is addictive.</p>'
}
