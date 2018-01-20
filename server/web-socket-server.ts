import * as http from 'http'
import * as https from 'https'
import { Request } from 'express'
import * as WebSocket from 'ws'
import { decodeJwt } from './security.utils'

function getCookiesMap(cookiesString): {[key: string]: string} {
  return cookiesString.split(';')
    .map(function (cookieString) {
      return cookieString.trim().split('=')
    })
    .reduce(function (acc, curr) {
      acc[curr[0]] = curr[1]
      return acc
    }, {})
}

export function addWebSocketServer(server: http.Server | https.Server) {

  // initialize the WebSocket server instance
  const wsServer = new WebSocket.Server({
    server,
    verifyClient: (info, done) => {
      const cookies = getCookiesMap(info.req.headers.cookie)
      const jwt = cookies.SESSIONID
      if (!jwt) {
        console.log('jwt is missing in a websocket connection attempt')
        done(false, 403, 'Forbidden')
      } else {
        decodeJwt(jwt).then((_decodedJwt) => {
          info.req['userId'] = _decodedJwt.sub  // currently only saving the userId on req
          done(_decodedJwt.sub)
        }).catch((err) => {
          console.log(err)
          done(false, 403, 'Forbidden - invalid jwt')
        })
      }
    },
  })

  wsServer.on('connection', (ws: WebSocket, req: Request) => {

    ws.on('message', (message: string) => {
      // log the received message and send it back to the client
      // console.log(_req.cookies)
      console.log(`received from ${req['userId']} : ${message}`)
      ws.send(`Hello, you ${req['userId']} sent -> ${message}`)
    })
    ws.on('close', (message: string) => {
      console.log(`close event received from ${req['userId']}: ${message}`)
    })

    // send immediatly a feedback to the incoming connection
    // const numListeners = wsServer.listenerCount()
    ws.send('Hi there, I am a WebSocket server')
    // console.log(wsServer.clients)
  })

}
