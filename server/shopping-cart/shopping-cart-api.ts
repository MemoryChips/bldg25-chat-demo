import { redisdb } from '../database/redis'
import { Request, Response } from 'express'

const type = 'shopping-cart'
function createShoppingCartId(id: string): string {
  return id = `${type}:${id}`
}

export function createShoppingCart(_req: Request, res: Response) {
  redisdb.createItem(type).then((cartId) => {
    if (cartId) {
      return res.status(200).json(cartId)
    }
    res.status(403).json('Unable to create shopping cart')
  }).catch(err => res.status(403).json(err))
}

export function getShoppingCart(req: Request, res: Response) {
  if (req.params.id) {
    const cartId = createShoppingCartId(req.params.id)
    redisdb.getOrCreateItem(cartId).then(cart => {
      res.status(200).json(JSON.parse(cart))
    })
  } else {
    res.status(403).json('Error trying to get or create shopping cart')
  }
}

export function putShoppingCart(req: Request, res: Response) {
  if (req.body.cartId && req.body.cart) {
    const item = JSON.stringify(req.body.cart)
    const itemId = createShoppingCartId(req.body.cartId)
    redisdb.setItem(itemId, item).then((success) => {
      res.status(200).json({success})
    })
  } else {
    res.status(403).json('Missing info to put shopping cart')
  }
}

export function deleteShoppingCart(req: Request, res: Response) {
  if (req.params.id) {
    const cartId = createShoppingCartId(req.params.id)
    redisdb.deleteItem(cartId).then(success => {
      res.status(200).json({success})
    })
  } else {
    res.status(403).json('Unable to find shopping cart')
  }
}
