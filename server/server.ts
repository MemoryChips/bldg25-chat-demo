// import { addWebSocketServer } from './web-socket-server'
// import { ChatWebSocketServer } from './web-socket-server'
import * as express from 'express'
import * as http from 'http'
import { retrieveUserIdFromRequest } from './auth/mware/get-user'

import { authRouter } from './auth/auth-routes-api'
import { productRouter } from './product/product-routes'
import { shoppingCartRouter } from './shopping-cart/shopping-cart-routes'
import { orderRouter } from './order/order-routes'
const bodyParser = require('body-parser')
// import cookieParser = require('cookie-parser')
import * as cookieParser from 'cookie-parser'

// const env = process.env.NODE_ENV || 'development'
const app: express.Application = express()

const server = http.createServer(app)
const serverInfo = 'HTTP Server running at http://localhost:'

// addWebSocketServer(server)
// const chatServer = new ChatWebSocketServer(server)
// const info = chatServer.options
// console.log(info)

app.use(cookieParser())
app.use(retrieveUserIdFromRequest)
app.use(bodyParser.json())

// for serving in production
if (process.env.PROD) {
  app.use(express.static(__dirname + '/dist'))
}

// for product images
// http://localhost:9000/api/image-files/avocado.jpg
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

server.listen(port, () => console.log(serverInfo + server.address().port))
