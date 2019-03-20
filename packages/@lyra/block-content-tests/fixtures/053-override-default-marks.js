module.exports = {
  input: {
    _type: 'block',
    children: [
      {
        _key: 'a1ph4',
        _type: 'span',
        marks: ['mark1'],
        text: 'Lyra'
      }
    ],
    markDefs: [
      {
        _key: 'mark1',
        _type: 'link',
        href: 'https://vegapublish.com'
      }
    ]
  },
  output: '<p><a class="mahlink" href="https://vegapublish.com">Lyra</a></p>'
}
