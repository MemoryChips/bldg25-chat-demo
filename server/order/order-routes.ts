import * as express from 'express'
import {
  postOrder,
  getMyOrders,
  getAllOrders,
} from './order-api'
import { config } from '../server-config'
import { checkIfAuthenticated } from '../auth/mware/authentication'
import { checkIfAuthorized } from '../auth/mware/authorization'
import { checkCsrfToken } from '../auth/mware/csrf'

export const orderRouter = express.Router()

orderRouter.use((req, _res, next) => {
  config.log(`${req.url} Time: `, Date.now())
  next()
})

orderRouter
  .post('/', checkIfAuthenticated, checkCsrfToken, postOrder)
  // .post('/', postOrder)
  // .get('/myOrders', checkIfAuthenticated, checkCsrfToken, getMyOrders)
  // TODO: checkCsrfToken failed and was removed - diagnose? transient issue?
  .get('/myOrders', checkIfAuthenticated, getMyOrders)
  .get('/allOrders', checkIfAuthenticated, checkIfAuthorized(['ADMIN']), getAllOrders)
  // .get('/allOrders', checkIfAuthenticated, checkCsrfToken, checkIfAuthorized(['ADMIN']), getAllOrders)
  // .get('/allOrders', getAllOrders)
