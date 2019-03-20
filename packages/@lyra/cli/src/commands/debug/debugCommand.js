import printDebugInfo from './printDebugInfo'

const help = `
Gathers information on user and local/global Lyra environment, to help
debugging Lyra-related issues. Pass --secrets to include API keys in output.`

export default {
  name: 'debug',
  signature: '[--secrets]',
  description: 'Gathers information on Lyra environment',
  helpText: help,
  action: printDebugInfo
}
