import lazyRequire from '@lyra/util/lib/lazyRequire'

const helpText = `
Options
  --with-user-token

Examples
  # Run the script at some/script.js in Lyra context
  lyra exec some/script.js

  # Run the script at migrations/fullname.js and configure \`part:@lyra/base/client\`
  # to include the current users token
  lyra exec migrations/fullname.js --with-user-token
`

export default {
  name: 'exec',
  signature: 'SCRIPT',
  description: 'Runs a script in Lyra context',
  helpText,
  action: lazyRequire(require.resolve('../../actions/exec/execScript'))
}
