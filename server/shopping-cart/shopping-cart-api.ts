import { db } from '../database'
import { Request, Response } from 'express'

export function createShoppingCart(_req: Request, res: Response) {
  const cartId = db.createShoppingCart()
  if (cartId) {
    return res.status(200).json(cartId)
  }
  res.status(403).json('Unable to create shopping cart')
}

export function deleteShoppingCartItem(req: Request, res: Response) {
  const cartId = req.query.cartid
  const itemId = req.query.key
  if (cartId && itemId) {
    if (db.deleteShoppingCartItem(cartId, itemId)) {
      return res.status(200).json(db.getShoppingCart(cartId))
    }
  }
  res.status(403).json('Unable to find shopping cart or item to delete')
}

export function putShoppingCartItem(req: Request, res: Response) {
  const cartId = req.body.cartId
  const item = req.body.updateItem
  if (cartId && item) {
    if (db.putShoppingCartItem(cartId, item, item.key)) {
      return res.status(200).json(db.getShoppingCart(cartId))
    }
  }
  res.status(403).json('Unable to find shopping cart')
}

export function deleteShoppingCart(req: Request, res: Response) {
  const cartId = req.params.id
  if (cartId) {
    const newCartId = db.deleteShoppingCart(cartId)
    return res.status(200).json(newCartId)
  }
  res.status(403).json('Unable to find shopping cart')
}

export function getShoppingCart(req: Request, res: Response) {
  const cartId = req.params.id
  if (cartId) {
    // just return cart
    return res.status(200).json(db.getShoppingCart(cartId))
  }
  res.status(403).json('Unable to find shopping cart')
}

export function getShoppingCartItem(req: Request, res: Response) {
  const cartId = req.params.cartId
  const itemId = req.params.itemId
  if (cartId && itemId) {
    // just return cart
    return res.status(200).json(db.getShoppingCartItem(cartId, itemId))
  }
  res.status(403).json('Unable to find shopping cart')
}
