module.exports = {
  input: [
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          marks: [],
          text: 'lyra'
        },
        {
          _type: 'span',
          marks: [],
          text: ' is a full time job'
        }
      ],
      markDefs: [],
      style: 'normal'
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          marks: [],
          text: 'in a world that '
        },
        {
          _type: 'span',
          marks: [],
          text: 'is always changing'
        }
      ],
      markDefs: [],
      style: 'normal'
    }
  ],
  output:
    '<div><p>lyra is a full time job</p><p>in a world that is always changing</p></div>'
}
