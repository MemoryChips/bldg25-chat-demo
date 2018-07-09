import * as express from 'express'
import * as http from 'http'
import * as https from 'https'
import * as fs from 'fs'

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

app.use(cookieParser())
app.use(retrieveUserIdFromRequest)
app.use(bodyParser.json())

// for serving in production
if (process.env.PROD) {
  app.use(express.static(__dirname + '/dist'))
}

// REST API
app.use('/api/product', productRouter)
app.use('/api/shopping-carts', shoppingCartRouter)
app.use('/api/auth', authRouter)
app.use('/api/order', orderRouter)

// heroku deployment
const port = process.env.PORT || serverConfig.port
if (process.env.PROD) {
  // gives response when user refreshes some random url in angular
  app.all('*', (_req, res) => {
    res.status(200).sendFile(__dirname + '/dist/index.html')
  })
}

if (serverConfig.secure) {
  // launch an HTTPS Server. Note: this does NOT mean that the application is secure
  const httpsServer = https.createServer(
    { key: fs.readFileSync('key.pem'), cert: fs.readFileSync('cert.pem') },
    app
  )

  // *** Chat server must be added to the express server as follows:
  // tslint:disable-next-line:no-unused-expression
  new ChatWebSocketServer(httpsServer, chatConfig)

  httpsServer.listen(port, () => {
    console.log(`HTTPS Server running at port: ${port}`)
  })
} else {
  // launch an HTTP Server
  const httpServer = http.createServer(app)

  // *** Chat server must be added to the express server as follows:
  // tslint:disable-next-line:no-unused-expression
  new ChatWebSocketServer(httpServer, chatConfig)

  httpServer.listen(port, () => {
    console.log(`HTTP Server running at port: ${port}`)
  })
}
