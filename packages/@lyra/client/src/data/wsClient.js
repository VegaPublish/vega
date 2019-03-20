const UUID = require('uuid/v4')
const {of: observableOf, merge, concat, Observable} = require('rxjs')
const {
  filter,
  map,
  mergeMap,
  publishReplay,
  refCount,
  share,
  switchMap,
  take,
  takeWhile
} = require('rxjs/operators')

const RECONNECT_DELAY = 1000

function formatRpcMessage(id, method, params) {
  return JSON.stringify({jsonrpc: '2.0', id, method, params})
}

function sendMessage(ws, id, method, params) {
  return new Observable(subscriber => {
    ws.send(formatRpcMessage(id, method, params))
    subscriber.complete()
  })
}

module.exports = function createWsClient(WebSocketImpl, url, options) {
  const conn$ = new Observable(subscriber => {
    let socket
    let attemptNum = 0
    let reconnectTimer

    const onopen = () => {
      attemptNum = 0
      subscriber.next(socket)
    }

    const onerror = evt => {
      reconnect()
    }

    const onclose = evt => {
      if (evt.code !== 1000 && evt.code !== 1005) {
        reconnect()
      }
    }

    function reconnect() {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
      }

      const waitMs = Math.floor(RECONNECT_DELAY * Math.random() * ++attemptNum)
      reconnectTimer = setTimeout(open, waitMs, true)
    }

    function open(isReconnect) {
      dispose()
      socket = new WebSocketImpl(url, null, options)
      socket.addEventListener('open', onopen)
      socket.addEventListener('error', onerror)
      socket.addEventListener('close', onclose)
    }

    function dispose() {
      if (!socket) {
        return
      }

      socket.removeEventListener('open', onopen)
      socket.removeEventListener('error', onerror)
      socket.removeEventListener('close', onclose)
    }

    open()

    return () => {
      if (socket) {
        socket.close()
        dispose()
      }

      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
      }
    }
  }).pipe(
    publishReplay(1),
    refCount()
  )

  const incomingMessages$ = conn$.pipe(
    switchMap(
      ws =>
        new Observable(subscriber => {
          const onMessage = msg => subscriber.next(msg)
          ws.addEventListener('message', onMessage)
          return () => {
            ws.removeEventListener('message', onMessage)
          }
        })
    ),
    map(msg => JSON.parse(msg.data)),
    share()
  )

  const request = (method, data) => {
    const id = UUID()
    const request$ = conn$.pipe(
      take(1),
      mergeMap(ws => sendMessage(ws, id, method, data))
    )

    const repliesForMessage$ = incomingMessages$.pipe(
      filter(message => message.id === id)
    )

    const replies$ = repliesForMessage$.pipe(
      take(1),
      mergeMap(message => {
        const incomingMessage = observableOf(message)
        return message.stream
          ? concat(
              incomingMessage,
              repliesForMessage$.pipe(takeWhile(msg => !msg.complete))
            )
          : incomingMessage
      }),
      map(message => message.result)
    )

    const cancel$ = conn$.pipe(
      mergeMap(
        ws =>
          new Observable(() => () =>
            ws.readyState === WebSocket.OPEN &&
            ws.send(formatRpcMessage(id, 'cancel'))
          )
      )
    )

    return merge(request$, replies$, cancel$)
  }

  return {request, unsubscribe: conn$.unsubscribe}
}
