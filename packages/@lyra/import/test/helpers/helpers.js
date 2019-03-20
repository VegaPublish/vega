const noop = require('lodash/noop')
const lyraClient = require('@lyra/client')
const {injectResponse} = require('get-it/middleware')

process.on('unhandledRejection', reason => {
  // eslint-disable-next-line no-console
  console.error('UNHANDLED REJECTION', reason)
})

const defaultClientOptions = {
  apiHost: 'http://lyra.api',
  dataset: 'bar',
  token: 'abc123',
  useCdn: false
}

const getLyraClient = (inject = noop, opts = {}) => {
  const requester = lyraClient.requester.clone()
  requester.use(injectResponse({inject}))
  const req = {requester: requester}
  const client = lyraClient(Object.assign(defaultClientOptions, req, opts))
  return client
}

module.exports = {
  getLyraClient
}
