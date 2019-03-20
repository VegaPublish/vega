export default {
  // Dependencies for a default Lyra installation
  core: {
    '@lyra/cli': 'latest',
    '@lyra/base': 'latest',
    '@lyra/components': 'latest',
    '@lyra/core': 'latest',
    '@lyra/default-login': 'latest',
    "@lyra/google-maps-input": "latest",
    "@lyra/form-builder": "latest",
    "@lyra/desk-tool": "latest",
    "@lyra/vision": "latest",
    "@vega/core": "latest",
    "@vega/components": "latest",
    "@vega/layout": "latest",
    "@vega/theme": "latest",
    "@vega/communicator-system": "latest",
    "@vega/issues-tool": "latest",
    "@vega/tracks-tool": "latest",
    "@vega/composer-tool": "latest",
    "@vega/submissions-tool": "latest",
    "@vega/review-tool": "latest",
    "@vega/article-state-tool": "latest",
    "@vega/feature-checklist": "latest",
    "@vega/feature-declaration": "latest",
    "@vega/feature-due-date": "latest",
    "@vega/feature-notifier": "latest",
    react: '^16.2',
    'react-dom': '^16.2',
    'prop-types': '^15.6'
  },

  // Only used for Lyra-style plugins (eg, the ones we build at Vegapublish.com)
  plugin: {
    dev: {
      '@lyra/check': 'latest',
      'babel-cli': '^6.9.0',
      'babel-eslint': '^6.0.4',
      'babel-plugin-syntax-class-properties': '^6.8.0',
      'babel-plugin-transform-class-properties': '^6.9.1',
      'babel-preset-es2015': '^6.9.0',
      'babel-preset-react': '^6.5.0',
      eslint: '^3.4.0',
      'eslint-plugin-react': '^6.3.0',
      rimraf: '^2.5.2'
    },
    prod: {
      'in-publish': '^2.0.0'
    }
  }
}
