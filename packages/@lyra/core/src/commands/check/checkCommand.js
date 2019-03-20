import lyraCheck from '@lyra/check'

export default {
  name: 'check',
  signature: '[DIRECTORY]',
  description: 'Performs a Lyra check',
  action: (args, context) =>
    lyraCheck({
      dir: args.argsWithoutOptions[0] || context.workDir
    })
}
