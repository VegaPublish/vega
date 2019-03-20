module.exports = {
  input: {
    _type: 'block',
    children: [
      {
        _key: 'a1ph4',
        _type: 'span',
        marks: ['zomgLink'],
        text: 'Lyra'
      },
      {
        _key: 'b374',
        _type: 'span',
        marks: [],
        text: ' can be used to power almost any '
      },
      {
        _key: 'ch4r1i3',
        _type: 'span',
        marks: ['zomgLink', 'strong', 'em'],
        text: 'app'
      },
      {
        _key: 'd3174',
        _type: 'span',
        marks: ['em', 'zomgLink'],
        text: ' or website'
      },
      {
        _key: 'ech0',
        _type: 'span',
        marks: [],
        text: '.'
      }
    ],
    markDefs: [
      {
        _key: 'zomgLink',
        _type: 'link',
        href: 'https://vegapublish.com/'
      }
    ],
    style: 'blockquote'
  },
  output:
    '<blockquote><a href="https://vegapublish.com/">Lyra</a> can be used to power almost any <a href="https://vegapublish.com/"><em><strong>app</strong> or website</em></a>.</blockquote>'
}
