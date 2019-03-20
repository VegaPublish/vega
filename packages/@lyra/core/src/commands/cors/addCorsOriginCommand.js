const addCorsOrigin = require('../../actions/cors/addCorsOrigin')

const helpText = `
Examples
  lyra cors add
  lyra cors add http://localhost:3000
`

export default {
  name: 'add',
  group: 'cors',
  signature: '[ORIGIN]',
  helpText,
  description: 'Allow a new origin to use your project API through CORS',
  action: async (args, context) => {
    const {output} = context
    const [origin] = args.argsWithoutOptions
    await addCorsOrigin(origin, context)
    output.print('CORS origin added successfully')
  }
}
