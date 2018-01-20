import { addWebSocketServer } from './web-socket-server'
import * as express from 'express'
import * as http from 'http'
import { db } from './database'
import { createUser, saveUser } from './create-user.route'
import { getUser } from './get-user.route'
import { logout } from './logout.route'
import { login } from './login.route'
import { retrieveUserIdFromRequest } from './get-user.middleware'
import { checkIfAuthenticated } from './authentication.middleware'
import { checkCsrfToken } from './csrf.middleware'
import { checkIfAuthorized } from './authorization.middleware'
import { loginAsUser } from './login-as-user.route'

import { shoppingCartRouter } from './shopping-cart/shopping-cart-routes'

const bodyParser = require('body-parser')
import cookieParser = require('cookie-parser')

// const env = process.env.NODE_ENV || 'development'
const app: express.Application = express()

const server = http.createServer(app)
const serverInfo = 'HTTP Server running at http://localhost:'

addWebSocketServer(server)

app.use(cookieParser())
app.use(retrieveUserIdFromRequest)
app.use(bodyParser.json())

// REST API
app.route('/api/products')
  .get((_req, res) => {
    res.status(200).send(db.readAllProducts())
  })
app.route('/api/products')
  .put(
  checkIfAuthenticated,
  checkIfAuthorized(['ADMIN']),
  db.createProduct
  )

app.route('/api/categories')
  .get((_req, res) => {
    res.status(200).send(db.readAllCategories())
  })

app.use('/api/shopping-carts', shoppingCartRouter)

app.route('/api/admin')
  .post(checkIfAuthenticated,
  checkIfAuthorized(['ADMIN']),
  loginAsUser)

app.route('/api/signup')
  .post(createUser)

app.route('/api/user')
  .get(getUser)

app.route('/api/user')
  .put(
  checkIfAuthenticated,
  saveUser
  )

app.route('/api/logout')
  .post(checkIfAuthenticated, checkCsrfToken, logout)

app.route('/api/login')
  .post(login)

server.listen(9000, () => console.log(serverInfo + server.address().port))

