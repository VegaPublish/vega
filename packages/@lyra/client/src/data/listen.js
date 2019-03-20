const ws = require('ws')
const {filter, tap} = require('rxjs/operators')
const pick = require('../util/pick')
const defaults = require('../util/defaults')
const createWsClient = require('./wsClient')

const possibleOptions = ['includePreviousRevision', 'includeResult']
const defaultOptions = {
  includeResult: true
}

const clients = {}

module.exports = function listen(query, params, opts = {}) {
  const {url, token} = this.clientConfig
  const uri = `${url}${this.getDataUrl('channel')}`.replace(/^http/, 'ws')
  const key = `${uri}${token ? token.slice(0, 5) : ''}`
  const headers = token ? {Authorization: `Bearer ${token}`} : undefined

  // @todo improve this - observables?
  let client = clients[key]
  if (!client) {
    clients[key] = createWsClient(ws, uri, {headers})
    client = clients[key]
  }

  const options = defaults(opts, defaultOptions)
  const listenOpts = pick(options, possibleOptions)
  const {includePreviousRevision, includeResult} = listenOpts
  const listenFor = options.events ? options.events : ['mutation']
  const shouldEmitReconnect = listenFor.indexOf('reconnect') !== -1 // @todo

  return client
    .request('listen', {query, params, includePreviousRevision, includeResult})
    .pipe(filter(msg => listenFor.includes(msg.type)))
}
