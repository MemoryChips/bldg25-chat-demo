import * as express from 'express'
import {
  createShoppingCart,
  getShoppingCart,
  deleteShoppingCartItem,
  getShoppingCartItem,
  deleteShoppingCart,
  putShoppingCartItem
} from './shopping-cart-api'

export const shoppingCartRouter = express.Router()

shoppingCartRouter.use((req, _res, next) => {
  console.log(`${req.url} Time: `, Date.now())
  next()
})

shoppingCartRouter
  .put('/item', putShoppingCartItem)
  .get('/item/:id', getShoppingCartItem)
  .delete('/item', deleteShoppingCartItem)
  .get('/:id', getShoppingCart)
  .delete('/:id', deleteShoppingCart)
  .put('/', createShoppingCart)
