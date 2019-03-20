const assign = require('object-assign')
const {filter, map} = require('rxjs/operators')
const Patch = require('./data/patch')
const Transaction = require('./data/transaction')
const dataMethods = require('./data/dataMethods')
const DatasetsClient = require('./datasets/datasetsClient')
const ProjectsClient = require('./projects/projectsClient')
const AssetsClient = require('./assets/assetsClient')
const UsersClient = require('./users/usersClient')
const AuthClient = require('./auth/authClient')
const httpRequest = require('./http/request')
const getRequestOptions = require('./http/requestOptions')
const {defaultConfig, initConfig} = require('./config')

const toPromise = observable => observable.toPromise()

function LyraClient(config = defaultConfig) {
  if (!(this instanceof LyraClient)) {
    return new LyraClient(config)
  }

  this.config(config)

  this.assets = new AssetsClient(this)
  this.datasets = new DatasetsClient(this)
  this.projects = new ProjectsClient(this)
  this.users = new UsersClient(this)
  this.auth = new AuthClient(this)

  if (this.clientConfig.isPromiseAPI) {
    const observableConfig = assign({}, this.clientConfig, {
      isPromiseAPI: false
    })
    this.observable = new LyraClient(observableConfig)
  }
}

assign(LyraClient.prototype, dataMethods)
assign(LyraClient.prototype, {
  clone() {
    return new LyraClient(this.config())
  },

  config(newConfig) {
    if (typeof newConfig === 'undefined') {
      return assign({}, this.clientConfig)
    }

    if (this.observable) {
      const observableConfig = assign({}, newConfig, {isPromiseAPI: false})
      this.observable.config(observableConfig)
    }

    this.clientConfig = initConfig(newConfig, this.clientConfig || {})
    return this
  },

  getUrl(uri) {
    return `${this.clientConfig.url}/${uri.replace(/^\//, '')}`
  },

  isPromiseAPI() {
    return this.clientConfig.isPromiseAPI
  },

  _requestObservable(options) {
    const uri = options.url || options.uri
    return httpRequest(
      mergeOptions(getRequestOptions(this.clientConfig), options, {
        url: this.getUrl(uri)
      }),
      this.clientConfig.requester
    )
  },

  request(options) {
    const observable = this._requestObservable(options).pipe(
      filter(event => event.type === 'response'),
      map(event => event.body)
    )

    return this.isPromiseAPI() ? toPromise(observable) : observable
  }
})

// Merge http options and headers
function mergeOptions(...opts) {
  const headers = opts.reduce((merged, options) => {
    if (!merged && !options.headers) {
      return null
    }
    return assign(merged || {}, options.headers || {})
  }, null)
  return assign(...opts, headers ? {headers} : {})
}

LyraClient.Patch = Patch
LyraClient.Transaction = Transaction
LyraClient.ClientError = httpRequest.ClientError
LyraClient.ServerError = httpRequest.ServerError
LyraClient.requester = httpRequest.defaultRequester

module.exports = LyraClient
