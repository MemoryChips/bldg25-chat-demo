import express from 'express'
import cookieParser from 'cookie-parser'

import * as http from 'http'
import * as https from 'https'
import * as fs from 'fs'

import { getUserFromRequest } from './auth/mware/get-user'

import { authRouter } from './auth/auth-routes-api'
import { productRouter } from './product/product-routes'
import { shoppingCartRouter } from './shopping-cart/shopping-cart-routes'
import { orderRouter } from './order/order-routes'
import bodyParser from 'body-parser'

import redis, { RedisClient } from 'redis'
import { RedisCategoryDatabase } from './database/redis-categories'

import { MongoUserDatabase, USER_DB } from './database/mongo-users'
import { MongoProductDatabase, PRODUCT_DB } from './database/mongo-products'
import { MongoCategoryDatabase } from './database/mongo-categories'
import { MongoShoppingCartDatabase } from './database/mongo-shopping-cart'
import { SHOPPING_CART_DB } from './shopping-cart/shopping-cart-api'
import { CATEGORIES_DB } from './product/product-api'

// necessary imports from bldg25 chat server package
import {
  attachVideoSocketServer,
  // ChatRedisDatabase
  ChatMongoDataBase,
  ChatDatabase
} from 'bldg25-chat-server'
import { MongoClient } from 'mongodb'

import { serverConfig } from './server-config'

/*
This must be provided by the parent application to the Chat Server
*/
import { verifySocketConnection } from './auth/security'

// const env = process.env.NODE_ENV || 'development'
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
    // res.status(200).sendFile(__dirname + '/index.html')
  })
}

// FIXME: rework this into a promise as in done in dev version
function getRedisClient() {
  const redisDbHost = 'localhost'
  const redisDbPort = 6379
  const redisDbAuthCode = 'this_should_be_a_secret_authcode'
  const redisDbNum = 2 // use 0 when using a cloud redis server
  // const redisDbHost = !!options.dbHost ? options.dbHost : 'localhost'
  // const redisDbPort = !!options.dbPort ? options.dbPort : 6379
  // const redisDbAuthCode = !!options.dbAuth ? options.dbAuth : 'this_should_be_a_secret_authcode'
  console.log(`Using ${redisDbHost}:${redisDbPort} for redis database`)
  console.log(`Using authcode ${redisDbAuthCode} for redis database`)
  const redisClient: RedisClient = redis.createClient(redisDbPort, redisDbHost, {
    retry_strategy: options => {
      console.log(
        `Trying to reconnect: ${options.attempt} attempt. ${
          options.total_retry_time
        } total retry time.`
      )
      return 5000
    }
  })
  redisClient.on('connect', _e => {
    const authorized = redisClient.auth(redisDbAuthCode)
    redisClient.select(redisDbNum)
    console.log(`Database ${redisDbNum} selected with Authorization: ${authorized}`)
  })
  redisClient.on('reconnecting', _e => {
    console.log(`Attempting reconnect`)
  })
  return redisClient
}

// Create database connection for chat
// configure either TODO: redis, mongo, or TODO: default to memory
MongoClient.connect(
  serverConfig.mongoUrl,
  { useNewUrlParser: true }
)
  .then(client => {
    const chatDb = new ChatMongoDataBase(client, serverConfig.mongoDataBase)
    app.locals.CHAT_DB = chatDb // Optionally add chatDb to app.locals for use when main app signs up a user
    if (serverConfig.useRedisLocal) {
      app.locals[CATEGORIES_DB] = new RedisCategoryDatabase(getRedisClient())
    } else {
      app.locals[CATEGORIES_DB] = new MongoCategoryDatabase(client, serverConfig.mongoDataBase)
    }
    app.locals[PRODUCT_DB] = new MongoProductDatabase(client, serverConfig.mongoDataBase)
    app.locals[SHOPPING_CART_DB] = new MongoShoppingCartDatabase(client, serverConfig.mongoDataBase)
    app.locals[USER_DB] = new MongoUserDatabase(client, serverConfig.mongoDataBase)
    runServer(chatDb)
  })
  .catch(err => {
    console.log(`Mongo url used: ${serverConfig.mongoUrl}`)
    console.log(`Error while connecting: ${err}`)
  })

function runServer(dbChat: ChatDatabase) {
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
    attachVideoSocketServer(httpsServer, dbChat, verifySocketConnection)

    httpsServer.listen(port, () => {
      console.log(`HTTPS Server running at port: ${port}`)
    })
  } else {
    // launch an HTTP Server
    const httpServer = http.createServer(app)

    // *** Chat server must be added to the express server as follows:
    attachVideoSocketServer(httpServer, dbChat, verifySocketConnection)

    httpServer.listen(port, () => {
      console.log(`HTTP Server running at port: ${port}`)
    })
  }
}
