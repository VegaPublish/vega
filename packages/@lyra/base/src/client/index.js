import lyraClient from '@lyra/client'
import config from 'config:lyra'
import configureClient from 'part:@lyra/base/configure-client?'

const deprecationMessage = `[deprecation] The Lyra client is now exposed in CommonJS format.

For instance, change:
  \`const client = require('part:@lyra/base/client').default\`

To the following:
  \`const client = require('part:@lyra/base/client')\`
`

const apiConfig = {...config.api, withCredentials: true, useCdn: false}
const client = lyraClient(apiConfig)

const configuredClient = configureClient
  ? configureClient(lyraClient(apiConfig))
  : client

// Warn when people use `.default`
Object.defineProperty(configuredClient, 'default', {
  get() {
    // eslint-disable-next-line no-console
    console.warn(deprecationMessage)
    return configuredClient
  }
})

// Expose as CJS to allow Node scripts to consume it without `.default`
module.exports = configuredClient
