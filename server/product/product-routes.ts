import * as express from 'express'
import {
  getAllProducts,
  getAllCategories,
  putPostProduct,
  getProduct,
  // deleteProduct,
} from './product-api'
import { checkIfAuthenticated } from '../auth/mware/authentication'
import { checkCsrfToken } from '../auth/mware/csrf'
import { checkIfAuthorized } from '../auth/mware/authorization'
export const productRouter = express.Router()

productRouter.use((req, _res, next) => {
  console.log(`${req.url} Time: `, Date.now())
  next()
})

productRouter
  .get('/all', getAllProducts)
  .get('/categories', getAllCategories)
  .get('/:id', getProduct)
  .put('/:id', putPostProduct)
  .put('/:id', checkIfAuthenticated, checkCsrfToken, checkIfAuthorized(['ADMIN']), putPostProduct )
  .post('/new-product', checkIfAuthenticated, checkCsrfToken, checkIfAuthorized(['ADMIN']), putPostProduct )
  // .delete('/:id', deleteProduct)
