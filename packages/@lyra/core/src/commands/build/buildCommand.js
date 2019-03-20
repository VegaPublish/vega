import lazyRequire from '@lyra/util/lib/lazyRequire'

const helpText = `
Options
  --source-maps Enable source maps for built bundles (increases size of bundle)
  --no-minify Skip minifying built Javascript (speeds up build, increases size of bundle)
  -y, --yes Use unattended mode, accepting defaults and using only flags for choices

Examples
  lyra build
  lyra build --no-minify --source-maps
`

export default {
  name: 'build',
  signature: '[OUTPUT_DIR]',
  description: 'Builds the current Lyra configuration to a static bundle',
  action: lazyRequire(require.resolve('../../actions/build/buildStaticAssets')),
  helpText
}
