import express from 'express'
import cookieParser from 'cookie-parser'

import http from 'http'
import https from 'https'
import fs from 'fs'

import { getUserFromRequest } from './auth/mware/get-user'

import { authRouter } from './auth/auth-routes-api'
import { productRouter } from './product/product-routes'
import { shoppingCartRouter } from './shopping-cart/shopping-cart-routes'
import { orderRouter } from './order/order-routes'
import bodyParser from 'body-parser'

import { RedisCategoryDatabase } from './database/redis-categories'
import { createRedisClient } from './database/create-redis-client'
import { createMongoClient } from './database/create-mongo-client'
import { MongoUserDatabase, USER_DB } from './database/mongo-users'
import { MongoProductDatabase, PRODUCT_DB } from './database/mongo-products'
import { MongoCategoryDatabase } from './database/mongo-categories'
import { MongoShoppingCartDatabase } from './database/mongo-shopping-cart'
import { SHOPPING_CART_DB } from './shopping-cart/shopping-cart-api'
import { CATEGORIES_DB } from './product/product-api'

// necessary imports from bldg25 chat server package
import {
  attachSocketServer,
  // ChatRedisDatabase,
  ChatMemoryDataBase,
  ChatMongoDataBase,
  ChatDatabase,
  clean
} from 'bldg25-chat-server'

import { serverConfig } from './server-config'

/*
This must be provided by the parent application to the Chat Server
*/
import { verifySocketConnection } from './auth/security'

const app: express.Application = express()

app.use(cookieParser())
app.use(getUserFromRequest)
app.use(bodyParser.json())

// for serving in production
if (process.env.PROD || serverConfig.prod) {
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
  })
}

// TODO: This is clumsy. Find cleaner way
const dataBases: any[] = []
dataBases.push(createMongoClient())
if (serverConfig.useRedisCategories) {
  dataBases.push(createRedisClient())
}
// Promise.all([createMongoClient(), createRedisClient()])
Promise.all(dataBases)
  .then(clients => {
    const [client, redisClient] = clients
    let chatDb: ChatDatabase
    if (!serverConfig.useChatMemDb) {
      console.log(`Using chat mongo database`)
      chatDb = new ChatMongoDataBase(client, serverConfig.mongoDataBase)
    } else {
      console.log(`Using chat memory database`)
      chatDb = new ChatMemoryDataBase()
    }
    app.locals.CHAT_DB = chatDb // Optionally add chatDb to app.locals for use when main app signs up a user
    app.locals[CATEGORIES_DB] = serverConfig.useRedisCategories
      ? new RedisCategoryDatabase(redisClient)
      : new MongoCategoryDatabase(client, serverConfig.mongoDataBase)
    app.locals[PRODUCT_DB] = new MongoProductDatabase(client, serverConfig.mongoDataBase)
    app.locals[SHOPPING_CART_DB] = new MongoShoppingCartDatabase(client, serverConfig.mongoDataBase)
    app.locals[USER_DB] = new MongoUserDatabase(client, serverConfig.mongoDataBase)
    runServer(chatDb)
  })
  .catch(err => {
    console.log(`Mongo url used: ${serverConfig.mongoUrl}`)
    console.log(`Error while connecting: ${err}`)
  })

async function runServer(dbChat: ChatDatabase) {
  const cleanResult = await clean(dbChat, app.locals[USER_DB])
  console.log(`Clean result: ${cleanResult}`)
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
    attachSocketServer(httpsServer, verifySocketConnection, dbChat)

    httpsServer.listen(port, () => {
      console.log(`HTTPS Server running at port: ${port}`)
    })
  } else {
    // launch an HTTP Server
    const httpServer = http.createServer(app)

    // *** Chat server must be added to the express server as follows:
    attachSocketServer(httpServer, verifySocketConnection, dbChat)

    httpServer.listen(port, () => {
      console.log(`HTTP Server running at port: ${port}`)
    })
  }
}
