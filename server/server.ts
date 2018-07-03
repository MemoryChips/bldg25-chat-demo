import * as express from 'express'
import * as http from 'http'
import { retrieveUserIdFromRequest } from './auth/mware/get-user'

import { authRouter } from './auth/auth-routes-api'
import { productRouter } from './product/product-routes'
import { shoppingCartRouter } from './shopping-cart/shopping-cart-routes'
import { orderRouter } from './order/order-routes'
const bodyParser = require('body-parser')
import * as cookieParser from 'cookie-parser'

import { ChatWebSocketServer } from 'bldg25-chat-server'
import { chatConfig, serverConfig } from './server-config'

// const env = process.env.NODE_ENV || 'development'
const app: express.Application = express()

const server = http.createServer(app)

app.use(cookieParser())
app.use(retrieveUserIdFromRequest)
app.use(bodyParser.json())

// for serving in production
if (process.env.PROD) {
  app.use(express.static(__dirname + '/dist'))
  app.use('/image-files', express.static(__dirname + '/dist' + '/images'))
} else {
  // for product images
  app.use('/image-files', express.static(__dirname + '/images'))
}

// REST API
app.use('/api/product', productRouter)
app.use('/api/shopping-carts', shoppingCartRouter)
app.use('/api/auth', authRouter)
app.use('/api/order', orderRouter)

// heroku deployment
if (process.env.PROD) {
  // gives response when user refreshes some random url in angular
  app.all('*', (_req, res) => {
    res.status(200).sendFile(__dirname + '/dist/index.html')
  })
}

// AUTH bnparXdTcWyvXxkz1CdlEscwXrreNI6Us3IeCdFzFsaLDJ7KYNmVSUkPcpVJ
// *** Chat server must be added to the express server as follows:
// tslint:disable-next-line:no-unused-expression
new ChatWebSocketServer(server, chatConfig)

server.listen(serverConfig.port, () =>
  console.log(`HTTP Api Server running on port: ${serverConfig.port}`)
)
