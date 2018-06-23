import * as express from 'express'
import * as http from 'http'
import { retrieveUserIdFromRequest } from './auth/mware/get-user'

import { authRouter } from './auth/auth-routes-api'
import { productRouter } from './product/product-routes'
import { shoppingCartRouter } from './shopping-cart/shopping-cart-routes'
import { orderRouter } from './order/order-routes'
const bodyParser = require('body-parser')
import * as cookieParser from 'cookie-parser'

import { ChatWebSocketServer, IChatConfig } from 'bldg25-chat-server'

import { defaultVerifyClient } from './auth/security' // *** verifies client credentials

// const env = process.env.NODE_ENV || 'development'
const app: express.Application = express()

const server = http.createServer(app)

app.use(cookieParser())
app.use(retrieveUserIdFromRequest)
app.use(bodyParser.json())

// for serving in production
if (process.env.PROD) {
  app.use(express.static(__dirname + '/dist'))
}

// for product images
app.use('/image-files', express.static(__dirname + '/images'))

// REST API
app.use('/api/product', productRouter)
app.use('/api/shopping-carts', shoppingCartRouter)
app.use('/api/auth', authRouter)
app.use('/api/order', orderRouter)

// heroku deployment
const port = process.env.PORT || 9000
if (process.env.PROD) {
  // gives response when user refreshes some random url in angular
  app.all('*', (_req, res) => {
    res.status(200).sendFile(__dirname + '/dist/index.html')
  })
}

// configuration of chat server and redisdb server used by the chat server
export const config: IChatConfig = {
  redisUrl: 'localhost', // *** set this to the url of the redis server
  chatServerHost: 'localhost', // *** set this to the url of the chat server
  redisPort: 6379, // *** set this to the port of the redis server
  redisDataBase: 1, // *** set this to the redis database number to be used by the chat server
  chatServerPort: 9000, // *** set this to the port of the chat server
  verifyClient: defaultVerifyClient,
  // verifyClient,
  redisDbAuthCode:
    process.env.REDIS_DB_AUTHCODE ||
    'bnparXdTcWyvXxkz1CdlEscwXrreNI6Us3IeCdFzFsaLDJ7KYNmVSUkPcpVJ'
}
// AUTH bnparXdTcWyvXxkz1CdlEscwXrreNI6Us3IeCdFzFsaLDJ7KYNmVSUkPcpVJ
// *** Chat server must be added to the express server as follows:
const chatServer = new ChatWebSocketServer(server, config)
const info = chatServer.webSocketServer.options
console.log(info)

const serverInfo = 'HTTP Server running at http://localhost:'
server.listen(port, () => console.log(serverInfo + server.address().port))
