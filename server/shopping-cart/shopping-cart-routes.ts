import express from 'express'
import {
  putShoppingCart,
  getShoppingCart,
  deleteShoppingCart,
  createShoppingCart
} from './shopping-cart-api'

export const shoppingCartRouter = express.Router()

shoppingCartRouter.use((req, _res, next) => {
  console.log(`${req.url} Time: `, Date.now())
  next()
})

shoppingCartRouter
  .post('/', createShoppingCart)
  .get('/:id', getShoppingCart)
  .put('/', putShoppingCart)
  .delete('/:id', deleteShoppingCart)
