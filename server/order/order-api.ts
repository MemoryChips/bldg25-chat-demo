import { Response } from 'express'
import { Database } from '../database/mongo'
import { User } from '../auth/models/user'

// const type = 'order'

// interface Req extends Request {
//   user: any
// }

export interface Order {
  userId: string
  email: string
  password: string
  userName: string
}

export function postOrder(req: any, res: Response) {
  const db: Database = req.app.locals.db
  const order: Order = req.body
  const user: User = res.locals.user
  db.createOrder(order, user._id).then(result => {
    if (result) res.status(200).json({ success: result })
    else res.status(403).json({ success: false, reason: 'unable to place order' })
  })
}

export function getMyOrders(req: any, res: Response) {
  const db: Database = req.app.locals.db
  // const userId = req.user.sub
  const userId: string = req.app.locals.userId
  db.getOrdersById(userId)
    .then(orders => {
      res.status(200).json(orders)
    })
    .catch(_err => {
      res.status(403).json([])
    })
}

export function getAllOrders(req: any, res: Response) {
  const db: Database = req.app.locals.db
  db.getAllOrders().then(orders => {
    if (orders) {
      res.send(200).json({ orders })
    } else {
      res.send(400).json(`success: false`)
    }
  })
}
