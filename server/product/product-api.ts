// import { redisdb } from '../database/redis'
import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { MongoProductDatabase, PRODUCT_DB } from '../database/mongo-products'
import { ShoppingCartDatabase, SHOPPING_CART_DB } from '../shopping-cart/shopping-cart-api'
import { categoriesPreload } from '../database/reset-app-db'

import { take } from 'rxjs/operators'
// align models FE: product.service BE: product.api
export interface ProductWoKey {
  title: string
  price: number
  imageUrl: string
  category: string
}
export interface Product extends ProductWoKey {
  key: string
}

export interface Category {
  title: string
  lead: string
  key: string
}
// end align models

// BE models only
export interface Categories {
  [key: string]: Category
}

export interface DbProduct extends ProductWoKey {
  _id?: ObjectId
}

export const CATEGORY_COLLECTION = 'categories'
export const CATEGORIES_DB = 'category-db'
export interface CategoryDatabase {
  saveAllCategories(cats: Categories): Promise<boolean>
  getAllCategories(): Promise<Categories>
}

export function resetAllProducts(req: Request, res: Response) {
  const db: MongoProductDatabase = req.app.locals[PRODUCT_DB]
  const dbSC: ShoppingCartDatabase = req.app.locals[SHOPPING_CART_DB]
  const dbCats: CategoryDatabase = req.app.locals[CATEGORIES_DB]
  Promise.all([
    db.resetAllProducts(),
    dbSC.clearAllCarts(),
    dbCats.saveAllCategories(categoriesPreload)
  ])
    .then(results => {
      if (results.every(result => result)) {
        return res.status(200).json({ success: true })
      }
      res.status(403).json({ success: false })
    })
    .catch(err => {
      res.status(500).json(`Internal server error: ${err}`)
    })
}

function convertToProduct(dbProduct: DbProduct): Product {
  const p: any = { ...dbProduct }
  p.key = p._id.toHexString()
  delete p._id
  return p
}

export function getAllProducts(req: Request, res: Response) {
  const db: MongoProductDatabase = req.app.locals[PRODUCT_DB]
  db.getAllProductsO()
    .pipe(take(1))
    .subscribe(
      dbProducts => {
        const products = dbProducts.map(convertToProduct)
        res.status(200).send(products)
      },
      err => {
        res.status(500).send(`Internal server error: ${err}`)
      }
    )
  // db.getAllProducts()
  //   .then(dbProducts => {
  //     const products = dbProducts.map(convertToProduct)
  //     res.status(200).send(products)
  //   })
  //   .catch(err => {
  //     res.status(500).send(`Internal server error: ${err}`)
  //   })
}

export function getProduct(req: Request, res: Response) {
  const db: MongoProductDatabase = req.app.locals[PRODUCT_DB]
  const productId: string = req.params.id
  db.getProductById(productId)
    .then(dbProduct => {
      if (dbProduct) res.status(200).json(convertToProduct(dbProduct))
      else res.status(403).send(`Unable to find product with id: ${productId}`)
    })
    .catch(err => {
      res.status(500).send(`Internal server error: ${err}`)
    })
}

export function putProduct(req: Request, res: Response) {
  const db: MongoProductDatabase = req.app.locals[PRODUCT_DB]
  const dbProduct: DbProduct = {
    title: req.body.title,
    price: req.body.price,
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
  const db: MongoProductDatabase = req.app.locals[PRODUCT_DB]
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
  const db: CategoryDatabase = req.app.locals[CATEGORIES_DB]
  db.getAllCategories()
    .then(cats => {
      res.status(200).json(cats)
    })
    .catch(err => {
      res.status(500).send(`Internal server error loading categories: ${err}`)
    })
}
