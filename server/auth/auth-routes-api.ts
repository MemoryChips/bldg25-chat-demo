import * as express from 'express'
import { createUser, login, logout, getJwtUser, getUser, deleteUser } from './auth-api'
import { checkIfAuthenticated } from './mware/authentication'
import { checkIfAuthorized } from './mware/authorization'
import { checkCsrfToken } from './mware/csrf'

export const authRouter = express.Router()

authRouter.use((req, _res, next) => {
  console.log(`${req.url} Time: `, Date.now())
  next()
})

authRouter
  .post('/signup', createUser)
  .post('/login', login)
  .post('/logout', checkIfAuthenticated, checkCsrfToken, logout)
  .get('/user-me', getJwtUser)
  .get('/user/:id', checkIfAuthenticated, getUser)
  // .get('/user/:id', checkIfAuthenticated, checkCsrfToken, getUser)
  // .put('/user/:id', checkIfAuthenticated, saveUser) // TODO: this route does not use the id in the route
  .delete('/user/:email', checkIfAuthenticated, checkIfAuthorized(['ADMIN']), deleteUser)
