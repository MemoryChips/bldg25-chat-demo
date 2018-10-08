// import { redisdb } from '../database/redis'
import { Request, Response } from 'express'
import { Product } from '../product/product-api'

export const SHOPPING_CART_COLLECTION = 'shopping-carts'
export const SHOPPING_CART_DB = 'shopping-carts-db'

// Align FE/BE
export interface Item {
  product: Product
  quantity: number
  key?: string
}

export interface Items {
  [k: string]: Item
}

export interface ICart {
  items: Items
  productIds: string[]
}
// end align with FE/BE

export interface ShoppingCartDatabase {
  quit(): void
  flushDb(): Promise<boolean>
  getShoppingCart(_id: string): Promise<ICart | null>
  createShoppingCart(): Promise<string>
  saveShoppingCart(cart: ICart, cartId: string): Promise<boolean>
  deleteShoppingCart(cartId: string): Promise<boolean>
}

// const type = 'shopping-cart'
// function createShoppingCartId(id: string): string {
//   return (id = `${type}:${id}`)
// }

export function createShoppingCart(req: Request, res: Response) {
  const db: ShoppingCartDatabase = req.app.locals[SHOPPING_CART_DB]
  db.createShoppingCart()
    .then(cartId => {
      if (cartId) {
        return res.status(200).json(cartId)
      }
      res.status(500).json('Server error. Unable to create shopping cart')
    })
    .catch(err => res.status(403).json(err))
}

export function getShoppingCart(req: Request, res: Response) {
  const db: ShoppingCartDatabase = req.app.locals[SHOPPING_CART_DB]
  if (req.params.id) {
    db.getShoppingCart(req.params.id).then(cart => {
      if (!cart) return res.status(403).json('Error trying to get or create shopping cart')
      res.status(200).json(cart)
    })
  } else {
    res.status(403).json('Error trying to get or create shopping cart')
  }
}

export function putShoppingCart(req: Request, res: Response) {
  const db: ShoppingCartDatabase = req.app.locals[SHOPPING_CART_DB]
  if (req.body.cartId && req.body.cart) {
    const cart: ICart = req.body.cart
    const cartId: string = req.body.cartId
    db.saveShoppingCart(cart, cartId).then(success => {
      res.status(200).json({ success })
    })
  } else {
    res.status(403).json('Missing info to put shopping cart')
  }
}

export function deleteShoppingCart(req: Request, res: Response) {
  const db: ShoppingCartDatabase = req.app.locals[SHOPPING_CART_DB]
  if (req.params.id) {
    db.deleteShoppingCart(req.params.id).then(success => {
      res.status(200).json({ success })
    })
  } else {
    res.status(403).json('Unable to find shopping cart')
  }
}
