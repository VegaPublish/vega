import open from 'opn'

export default {
  name: 'docs',
  signature: 'docs',
  description: 'Opens the Lyra documentation',
  action(args, context) {
    const {output} = context
    const {print} = output
    const url = 'https://www.vegapublish.com/docs/content-studio'

    print(`Opening ${url}`)
    open(url, {wait: false})
  }
}
