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
        _type: 'highlight',
        thickness: 5
      }
    ]
  },
  output: '<p><span style="border:5px solid;">Lyra</span></p>'
}
