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

export interface ProductWoKey {
  title: string
  price: number
  imageUrl: string
  category: string
}
export interface Product extends ProductWoKey {
  key: string
}

export interface DbProduct extends ProductWoKey {
  _id?: ObjectId
}

export function resetAllProducts(req: Request, res: Response) {
  const db: Database = req.app.locals.db
  db.resetAllProducts()
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

export function putProduct(req: Request, res: Response) {
  const db: Database = req.app.locals.db
  const dbProduct: DbProduct = {
    title: req.body.title,
    price: req.body.number,
    imageUrl: req.body.imageUrl,
    category: req.body.category
  }
  const productId: string = req.params && req.params.id ? req.params.id : undefined
  if (!productId) {
    res.status(403).send(`Id missing in update product request: ${dbProduct}`)
  }
  db.saveProduct(dbProduct, productId)
    .then(success => {
      if (success) {
        res.status(200).json({
          success
        })
      } else {
        res.status(403).send(`Unable to update product: ${dbProduct}`)
      }
    })
    .catch(err => {
      res.status(500).send(`Internal server error: ${err}`)
    })
}

export function postProduct(req: Request, res: Response) {
  const db: Database = req.app.locals.db
  const dbProduct: DbProduct = {
    title: req.body.title,
    price: req.body.number,
    imageUrl: req.body.imageUrl,
    category: req.body.category
  }
  db.createProduct(dbProduct)
    .then(success => {
      if (success) {
        res.status(200).json({
          success
        })
      } else {
        res.status(403).send(`Unable to create product: ${dbProduct}`)
      }
    })
    .catch(err => {
      res.status(500).send(`Internal server error: ${err}`)
    })
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
