import * as http from 'http'
import * as https from 'https'
import { Request } from 'express'
import * as WebSocket from 'ws'
import { decodeJwt } from './auth/security'
import { redisdb } from './database/redis'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

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

function verifyClient(info, done) {
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
}

interface ActiveUser {
  id: number
  userName: string
  roles: string[]
}

export class ChatWebSocketServer extends WebSocket.Server {

  private activeUsers: ActiveUser[] = []
  private activeUsers$ = new BehaviorSubject<ActiveUser[]>(this.activeUsers)

  constructor(server: http.Server | https.Server) {
    super({
      server,
      verifyClient: verifyClient
    })
    this.on('connection', this.connect )
    this.activeUsers$.subscribe(aUsers => {
      // TODO: llimit how often this is broadcasat but
      // be sure that the new client gets the aUsers list
      this.broadcast(JSON.stringify(aUsers))
    })
  }

  private connect(ws: WebSocket, req: Request) {
    redisdb.getUser(req['userId']).then(dbUser => {
      const activeUser: ActiveUser = {
        id: dbUser.id,
        userName: dbUser.userName,
        roles: dbUser.roles
      }
      // TODO: verify that the user is not already active
      this.activeUsers.push(activeUser)
      this.activeUsers$.next(this.activeUsers)
    })

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
  }

  private broadcast(data) {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }

}
export class ChatWebSocketServer2 {

  private activeUsers: ActiveUser[] = []
  private activeUsers$ = new BehaviorSubject<ActiveUser[]>(this.activeUsers)

  wsServer: WebSocket.Server

  constructor(server: http.Server | https.Server) {
    this.activeUsers = []
    this.wsServer = new WebSocket.Server({
      server,
      verifyClient: verifyClient
    }).on('connection', (ws: WebSocket, req: Request) => {
      this.connect(ws, req)
    })
    this.activeUsers$.subscribe(aUsers => {
      // TODO: llimit how often this is broadcasat but
      // be sure that the new client gets the aUsers list
      this.broadcast(aUsers)
    })
  }

  private broadcast(data) {
    this.wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }

  private connect(ws: WebSocket, req: Request) {
    redisdb.getUser(req['userId']).then(dbUser => {
      const activeUser: ActiveUser = {
        id: dbUser.id,
        userName: dbUser.userName,
        roles: dbUser.roles
      }
      // TODO: verify that the user is not already active
      this.activeUsers.push(activeUser)
      this.activeUsers$.next(this.activeUsers)
    })

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
  }

  // private verifyClient(info, done) {
  //   const cookies = this.getCookiesMap(info.req.headers.cookie)
  //   const jwt = cookies.SESSIONID
  //   if (!jwt) {
  //     console.log('jwt is missing in a websocket connection attempt')
  //     done(false, 403, 'Forbidden')
  //   } else {
  //     decodeJwt(jwt).then((_decodedJwt) => {
  //       info.req['userId'] = _decodedJwt.sub  // currently only saving the userId on req
  //       done(_decodedJwt.sub)
  //     }).catch((err) => {
  //       console.log(err)
  //       done(false, 403, 'Forbidden - invalid jwt')
  //     })
  //   }
  // }

  // private getCookiesMap(cookiesString): { [key: string]: string } {
  //   return cookiesString.split(';')
  //     .map(function (cookieString) {
  //       return cookieString.trim().split('=')
  //     })
  //     .reduce(function (acc, curr) {
  //       acc[curr[0]] = curr[1]
  //       return acc
  //     }, {})
  // }

}


// function broadcast(data)
// TODO: make this a class
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

  // activeUsers$.subscribe(aUsers => {
  //   wsServer.
  // })

  wsServer.on('connection', (ws: WebSocket, req: Request) => {

    // redisdb.getUser(req['userId']).then(dbUser => {
    //   const activeUser: ActiveUser = {
    //     id: dbUser.id,
    //     userName: dbUser.userName,
    //     roles: dbUser.roles
    //   }
    //   activeUsers.push(activeUser)
    //   activeUsers$.next(activeUsers)
    // })

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
