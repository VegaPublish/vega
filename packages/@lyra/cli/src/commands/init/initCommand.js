import initProject from '../../actions/init-project/initProject'
import initPlugin from '../../actions/init-plugin/initPlugin'

const helpText = `
Examples
  # Initialize a new project, prompt for required information along the way
  lyra init

  # Initialize a new plugin
  lyra init plugin
`

export default {
  name: 'init',
  signature: 'init [plugin]',
  description: 'Initialize a new Lyra project or plugin',
  helpText,
  action: (args, context) => {
    const [type] = args.argsWithoutOptions

    if (!type) {
      return initProject(args, context)
    }

    if (type === 'plugin') {
      return initPlugin(args, context)
    }

    return Promise.reject(new Error(`Unknown init type "${type}"`))
  }
}
