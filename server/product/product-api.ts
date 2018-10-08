// import { redisdb } from '../database/redis'
import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { Database } from '../database/mongo'

// FIXME: align backend and frontend models
export interface Category {
  title: string
  lead: string
  key: string
}

export interface Categories {
  [key: string]: Category
}
export interface Product {
  title: string
  price: number
  imageUrl: string
  category: string
  key: string
}

export interface DbProduct extends Product {
  _id?: ObjectId
}

export interface Products {
  [key: string]: DbProduct
}

export function resetAllProducts(req: Request, res: Response) {
  const db: Database = req.app.locals.db
  db.resetAllProducts() // TODO: Decide if this should also reset all categories
    .then(success => {
      res.status(200).send({ success })
    })
    .catch(err => {
      res.status(500).send(`Internal server error: ${err}`)
    })
}

export function getAllProducts(req: Request, res: Response) {
  // (<Database>req.app.locals.db)
  // ;(req.app.locals.db as Database)
  const db: Database = req.app.locals.db
  db.getAllProducts()
    .then(products => {
      res.status(200).send(products)
    })
    .catch(err => {
      res.status(500).send(`Internal server error: ${err}`)
    })
}

export function getProduct(req: Request, res: Response) {
  const db: Database = req.app.locals.db
  const productId: string = req.params.id
  db.getProductById(productId)
    .then(product => {
      if (product) res.status(200).json(product)
      else res.status(403).send(`Unable to find product with id: ${productId}`)
    })
    .catch(err => {
      res.status(500).send(`Internal server error: ${err}`)
    })
}

export function putPostProduct(req: Request, res: Response) {
  const db: Database = req.app.locals.db
  const product = req.body
  const productId: string = req.params && req.params.id ? req.params.id : undefined
  db.saveProduct(product, productId)
    .then(success => {
      if (success) {
        res.status(200).json({
          success
        })
      } else {
        res.status(403).send(`Unable to save product: ${product}`)
      }
    })
    .catch(err => {
      res.status(500).send(`Internal server error: ${err}`)
    })
  // redisdb
  //   .getItem('products')
  //   .then(sProducts => {
  //     const products: DbProducts = JSON.parse(sProducts)
  //     const productId: string =
  //       req.params && req.params.id ? req.params.id : redisdb.uniqueId()
  //     const product = req.body
  //     products[productId] = product
  //     redisdb.setItem('products', JSON.stringify(products)).then(success => {
  //       if (success) {
  //         res.status(200).json({ success })
  //       } else {
  //         res.status(403).send(`Unable to save product with id: ${productId}`)
  //       }
  //     })
  //   })
  //   .catch(err => {
  //     res.status(500).send(`Internal server error: ${err}`)
  //   })
}

export function getAllCategories(req: Request, res: Response) {
  const db: Database = req.app.locals.db
  db.getAllCategories()
    .then(cats => {
      res.status(200).json(cats)
    })
    .catch(err => {
      res.status(500).send(`Internal server error loading categories: ${err}`)
    })
}
// export function getAllCategories(_req: Request, res: Response) {
//   redisdb
//     .getItem('categories')
//     .then(items => {
//       res.status(200).send(items)
//     })
//     .catch(err => {
//       res.status(500).send(`Internal server error loading categories: ${err}`)
//     })
// }
