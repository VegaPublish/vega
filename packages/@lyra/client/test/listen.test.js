const test = require('tape')
const wsServer = require('./helpers/wsServer')

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
/*****************
 * LISTENER      *
 *****************/
test('[listener] can listen for mutations', t => {
  return wsServer()
    .then(server => wait().then(() => server))
    .then(server => server.close())
    .then(() => t.end())
})
