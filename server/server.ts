import express from 'express'
import cookieParser from 'cookie-parser'
// This style is needed by ts-node
// import * as express from 'express'
// import * as cookieParser from 'cookie-parser'

import * as http from 'http'
import * as https from 'https'
import * as fs from 'fs'

import { getUserFromRequest } from './auth/mware/get-user'

import { authRouter } from './auth/auth-routes-api'
import { productRouter } from './product/product-routes'
import { shoppingCartRouter } from './shopping-cart/shopping-cart-routes'
import { orderRouter } from './order/order-routes'
import bodyParser from 'body-parser'

import { attachVideoSocketServer } from 'bldg25-chat-server'
import { chatConfig, serverConfig } from './server-config'
import { verifySocketConnection } from './auth/security'

// const env = process.env.NODE_ENV || 'development'
const app: express.Application = express()

app.use(cookieParser())
app.use(getUserFromRequest)
app.use(bodyParser.json())

// for serving in production
if (process.env.PROD || serverConfig.prod) {
  // const webDir = `/home/rob/Documents/Training-GreenLanternOnly/bldg25-chat-6/bldg25-chat-demo/dist`
  const webDir = `${__dirname}`
  console.log(`Serving app from ${webDir}`)
  app.use(express.static(webDir))
}

// REST API
app.use('/api/product', productRouter)
app.use('/api/shopping-carts', shoppingCartRouter)
app.use('/api/auth', authRouter)
app.use('/api/order', orderRouter)

// heroku deployment
const port = process.env.PORT || serverConfig.port
if (process.env.PROD || serverConfig.prod) {
  console.log(`Running in prod mode: ${serverConfig.host}:${serverConfig.port}`)
  // gives response when user refreshes some random url in angular
  app.all('*', (_req: any, res: any) => {
    res.status(200).sendFile(__dirname + '/index.html')
    // res.status(200).sendFile(__dirname + '/index.html')
  })
}

if (serverConfig.secure) {
  // launch an HTTPS Server. Note: this does NOT mean that the application is secure
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync('./server/keys/key.pem'),
      cert: fs.readFileSync('./server/keys/cert.pem')
    },
    app
  )

  // *** Chat server must be added to the express server as follows:
  attachVideoSocketServer(httpsServer, chatConfig, verifySocketConnection)

  httpsServer.listen(port, () => {
    console.log(`HTTPS Server running at port: ${port}`)
  })
} else {
  // launch an HTTP Server
  const httpServer = http.createServer(app)

  // *** Chat server must be added to the express server as follows:
  attachVideoSocketServer(httpServer, chatConfig, verifySocketConnection)

  httpServer.listen(port, () => {
    console.log(`HTTP Server running at port: ${port}`)
  })
}
