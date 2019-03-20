const identity = inp => inp
const defaults = {normalize: identity}
const requireAll = require('require-all')
const fixtures = requireAll(`${__dirname}/fixtures`)

module.exports = function runTests(opts = {}) {
  const options = Object.assign({}, defaults, opts)
  const {render, h, normalize, getImageUrl} = options

  test('never mutates input', () => {
    Object.keys(fixtures)
      .map(name => fixtures[name])
      .forEach(fixture => {
        const highlight = () => h('mark')
        const serializers = {marks: {highlight}}
        const originalInput = JSON.parse(JSON.stringify(fixture.input))
        const passedInput = fixture.input
        try {
          render({
            blocks: passedInput,
            serializers,
            apiHost: 'https://lyra.api',
            dataset: 'production'
          })
        } catch (error) {
          // ignore
        }
        expect(originalInput).toEqual(passedInput)
      })
  })

  test('builds empty tree on empty block', () => {
    const {input, output} = require('./fixtures/001-empty-block')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('builds simple one-node tree on single, markless span', () => {
    const {input, output} = require('./fixtures/002-single-span')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('can force rendering of container on single child', () => {
    const {input, output} = require('./fixtures/002-single-span')
    const result = render({
      blocks: input,
      renderContainerOnSingleChild: true,
      className: 'container'
    })
    expect(normalize(result)).toEqual(
      normalize(`<div class="container">${output}</div>`)
    )
  })

  test('builds simple multi-node tree on markless spans', () => {
    const {input, output} = require('./fixtures/003-multiple-spans')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('builds annotated span on simple mark', () => {
    const {input, output} = require('./fixtures/004-basic-mark-single-span')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('builds annotated, joined span on adjacent, equal marks', () => {
    const {
      input,
      output
    } = require('./fixtures/005-basic-mark-multiple-adjacent-spans')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('builds annotated, nested spans in tree format', () => {
    const {input, output} = require('./fixtures/006-basic-mark-nested-marks')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('builds annotated spans with expanded marks on object-style marks', () => {
    const {input, output} = require('./fixtures/007-link-mark-def')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('builds correct structure from advanced, nested mark structure', () => {
    const {input, output} = require('./fixtures/009-messy-link-text')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('builds bullet lists in parent container', () => {
    const {input, output} = require('./fixtures/010-basic-bullet-list')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('builds numbered lists in parent container', () => {
    const {input, output} = require('./fixtures/011-basic-numbered-list')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('builds images with passed dataset', () => {
    const {input, output} = require('./fixtures/012-image-support')
    const result = render({
      blocks: input,
      apiHost: 'https://lyra.api',
      dataset: 'production'
    })
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('builds images with passed query params', () => {
    const {input} = require('./fixtures/013-materialized-image-support')
    const result = render({blocks: input, imageOptions: {w: 320, h: 240}})
    expect(result).toContain('5748x3832.jpg?w=320&amp;h=240')
  })

  test('builds nested lists', () => {
    const {input, output} = require('./fixtures/014-nested-lists')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('builds all basic marks as expected', () => {
    const {input, output} = require('./fixtures/015-all-basic-marks')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('builds weirdly complex lists without any issues', () => {
    const {input, output} = require('./fixtures/016-deep-weird-lists')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('renders all default block styles', () => {
    const {input, output} = require('./fixtures/017-all-default-block-styles')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('sorts marks correctly on equal number of occurences', () => {
    const {input, output} = require('./fixtures/018-marks-all-the-way-down')
    const marks = {
      highlight: ({mark, children}) =>
        h('span', {style: {border: `${mark.thickness}px solid`}}, children)
    }
    const result = render({blocks: input, serializers: {marks}})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('handles keyless blocks/spans', () => {
    const {input, output} = require('./fixtures/019-keyless')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('handles empty arrays', () => {
    const {input, output} = require('./fixtures/020-empty-array')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('handles lists without level', () => {
    const {input, output} = require('./fixtures/021-list-without-level')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('handles inline non-span nodes', () => {
    const {input, output} = require('./fixtures/022-inline-nodes')
    const result = render({
      blocks: input,
      apiHost: 'https://lyra.api',
      dataset: 'production'
    })
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('handles hardbreaks', () => {
    const {input, output} = require('./fixtures/023-hard-breaks')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('can disable hardbreak serializer', () => {
    const {input, output} = require('./fixtures/023-hard-breaks')
    const result = render({blocks: input, serializers: {hardBreak: false}})
    expect(normalize(result)).toEqual(
      normalize(output.replace(/<br\/>/g, '\n'))
    )
  })

  test('can customize hardbreak serializer', () => {
    const {input, output} = require('./fixtures/023-hard-breaks')
    const hardBreak = () => h('br', {className: 'dat-newline'})
    const result = render({blocks: input, serializers: {hardBreak}})
    expect(result).toEqual(
      normalize(output.replace(/<br\/>/g, '<br class="dat-newline"/>'))
    )
  })

  test('can nest marks correctly in block/marks context', () => {
    const {input, output} = require('./fixtures/024-inline-images')
    const result = render({
      blocks: input,
      apiHost: 'https://lyra.api',
      dataset: 'production'
    })
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('can render images with correct hotspot/crop', () => {
    const {input, output} = require('./fixtures/025-image-with-hotspot')
    const result = render({
      blocks: input,
      apiHost: 'https://lyra.api',
      dataset: 'production',
      imageOptions: {w: 320, h: 240}
    })
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('can render styled list items', () => {
    const {input, output} = require('./fixtures/027-styled-list-items')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('can specify custom serializer for custom block types', () => {
    const {input, output} = require('./fixtures/050-custom-block-type')
    const CodeRenderer = props => {
      expect(props).toMatchObject({
        children: [],
        node: {
          _key: '9a15ea2ed8a2',
          _type: 'code',
          code: input[0].code,
          language: 'javascript'
        },
        options: {imageOptions: {}}
      })
      return h(
        'pre',
        {'data-language': props.node.language},
        h('code', null, props.node.code)
      )
    }
    const types = {code: CodeRenderer}
    const result = render({blocks: input, serializers: {types}})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('can override default serializers', () => {
    const {input, output} = require('./fixtures/051-override-defaults')
    const ImageRenderer = props =>
      h('img', {alt: 'Such image', src: getImageUrl(props)})
    const types = {image: ImageRenderer}
    const result = render({
      blocks: input,
      serializers: {types},
      apiHost: 'https://lyra.api',
      dataset: 'production'
    })
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('can specify custom serializers for custom marks', () => {
    const {input, output} = require('./fixtures/052-custom-marks')
    const highlight = ({mark, children}) =>
      h('span', {style: {border: `${mark.thickness}px solid`}}, children)

    const result = render({blocks: input, serializers: {marks: {highlight}}})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('can specify custom serializers for defaults marks', () => {
    const {input, output} = require('./fixtures/053-override-default-marks')
    const link = ({mark, children}) =>
      h('a', {className: 'mahlink', href: mark.href}, children)

    const result = render({blocks: input, serializers: {marks: {link}}})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('can specify custom serializers for defaults marks', () => {
    const {input, output} = require('./fixtures/061-missing-mark-serializer')
    const result = render({blocks: input})
    expect(normalize(result)).toEqual(normalize(output))
  })

  test('can specify custom class name for container', () => {
    const input = [
      {
        _key: 'a',
        _type: 'block',
        children: [{_type: 'span', marks: [], text: 'Hei'}]
      },
      {
        _key: 'b',
        _type: 'block',
        children: [{_type: 'span', marks: [], text: 'Der'}]
      }
    ]
    const result = render({blocks: input, className: 'blockContent'})
    expect(result).toEqual(
      normalize('<div class="blockContent"><p>Hei</p><p>Der</p></div>')
    )
  })
}
