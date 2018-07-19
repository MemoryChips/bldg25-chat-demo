import { redisdb } from '../database/redis'
import { Request, Response } from 'express'

// FIXME: align backend and frontend models
export interface Category {
  title: string
  lead: string
  key?: string
}

export interface Categories {
  [key: string]: Category
}
export interface DbProduct {
  title: string
  price: number
  imageUrl: string
  category: string
  // key: string   // FIXME: this prop exists in FE version of Prodcut
}

export interface DbProducts {
  [key: string]: DbProduct
}

export function resetAllProducts(_req: Request, res: Response) {
  redisdb
    .resetAllProducts() // TODO: Decide if this should also reset all categories
    .then(success => {
      res.status(200).send({ success })
    })
    .catch(err => {
      res.status(500).send(`Internal server error: ${err}`)
    })
}

export function getAllProducts(_req: Request, res: Response) {
  redisdb
    .getAllProducts()
    .then(products => {
      res.status(200).send(products)
    })
    .catch(err => {
      res.status(500).send(`Internal server error: ${err}`)
    })
}

export function getProduct(req: Request, res: Response) {
  redisdb
    .getItem('products')
    .then(sProducts => {
      const products = JSON.parse(sProducts)
      const productId = req.params.id
      const product = products[productId]
      if (product) res.status(200).json(product)
      else res.status(403).send(`Unable to find product with id: ${productId}`)
    })
    .catch(err => {
      res.status(500).send(`Internal server error: ${err}`)
    })
}

export function putPostProduct(req: Request, res: Response) {
  redisdb
    .getItem('products')
    .then(sProducts => {
      const products: DbProducts = JSON.parse(sProducts)
      const productId: string =
        req.params && req.params.id ? req.params.id : redisdb.uniqueId()
      const product = req.body
      products[productId] = product
      redisdb.setItem('products', JSON.stringify(products)).then(success => {
        if (success) {
          res.status(200).json({ success })
        } else {
          res.status(403).send(`Unable to save product with id: ${productId}`)
        }
      })
    })
    .catch(err => {
      res.status(500).send(`Internal server error: ${err}`)
    })
}

export function getAllCategories(_req: Request, res: Response) {
  redisdb
    .getAllCategories()
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
