import { Response } from 'express'
import { redisdb } from '../database/redis'

const type = 'order'

// interface Req extends Request {
//   user: any
// }

interface Order {
  email: string
  password: string
  userName: string
}

export function postOrder(req: any, res: Response) {
  const order: Order = req.body
  const userId = req.user.sub
  redisdb.createItem(type, JSON.stringify(order)).then(uid => {
    redisdb
      .addSetItem(`order:user:${userId}`, `order:${uid}`)
      .then(_orderUserLink => {
        console.log(`added order link created${_orderUserLink}`)
        res.status(200).json({ success: true, userId })
      })
  })
}

export function getMyOrders(_req: any, res: Response) {
  const userId = _req.user.sub
  redisdb
    .getSmembers(`order:user:${userId}`)
    .then(orders => {
      res.status(200).json(orders)
    })
    .catch(_err => {
      res.status(200).json([])
    })
}

export function getAllOrders(_req: any, res: Response) {
  redisdb
    .getKeys(`order:user:*`)
    .then(keys => {
      const allUserPromises: Promise<string[]>[] = []
      keys.forEach(userKey => {
        allUserPromises.push(redisdb.getSmembers(userKey))
      })
      Promise.all(allUserPromises).then(results => {
        res.status(200).json(results)
      })
    })
    .catch(_err => {
      res.status(200).json([])
    })
}
