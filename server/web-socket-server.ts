import * as http from 'http'
import * as https from 'https'
import { Request } from 'express'
import * as WebSocket from 'ws'
import { decodeJwt } from './auth/security'
import { redisdb } from './database/redis'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { DbUser } from './auth/models/user'

function getCookiesMap(cookiesString): { [key: string]: string } {
  return cookiesString.split(';')
    .map(function (cookieString) {
      return cookieString.trim().split('=')
    })
    .reduce(function (acc, curr) {
      acc[curr[0]] = curr[1]
      return acc
    }, {})
}

function defaultVerifyClient(info, done) {
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

export interface ChatUser {
  userName: string
  roles: string[]
  loginTime: number
  isAdmin: boolean
}

export interface ChatUsers {
  [id: string]: ChatUser
}

interface Message {
  type: string
  payload: string
}
export class ChatWebSocketServer extends WebSocket.Server {

  private activeUsers: ChatUsers = {}
  private activeUsers$ = new BehaviorSubject<ChatUsers>(this.activeUsers)

  constructor(server: http.Server | https.Server, verifyClient = defaultVerifyClient) {
    super({
      server,
      verifyClient
    })
    this.on('connection', this.connect)
    this.activeUsers$.subscribe(aUsers => {
      // TODO: llimit how often this is broadcasat but
      // be sure that the new client gets the aUsers list
      this.broadcast(JSON.stringify(aUsers))
    })
  }

  private connect(ws: WebSocket, req: Request) {
    const id = req['userId']
    redisdb.getUser(id).then((dbUser: DbUser) => {
      const activeUser: ChatUser = {
        userName: dbUser.userName,
        roles: dbUser.roles,
        loginTime: new Date().getTime(),
        isAdmin: dbUser.roles.includes('ADMIN')
      }
      this.activeUsers[id] = activeUser
      this.activeUsers$.next(this.activeUsers)
    })

    ws.on('message', (message: string) => {
      // log the received message and send it back to the client
      // console.log(_req.cookies)
      console.log(`received from ${req['userId']} : ${message}`)
      this.send(ws, {
        type: 'message',
        payload: `Hello, you ${req['userId']} sent -> ${message}`
      })
      // ws.send(`Hello, you ${req['userId']} sent -> ${message}`)
    })
    ws.on('close', (message: string) => {
      console.log(`close event received from ${id}: ${message}`)
      delete this.activeUsers[id]
      console.log('Active users:')
      Object.keys(this.activeUsers).forEach(key => console.log(key))
      this.activeUsers$.next(this.activeUsers)
    })

    // send immediatly a feedback to the incoming connection
    // const numListeners = wsServer.listenerCount()
    this.send(ws, {
      type: 'message',
      payload: 'Hi there, I am a WebSocket server'
    })
  }

  private send(ws: WebSocket, m: Message) {
    ws.send(JSON.stringify(m))
  }
  private broadcast(payload, type = 'user_list') {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const message = { type, payload }
        client.send(JSON.stringify(message))
        // client.send({ type, payload })
      }
    })
  }

}
