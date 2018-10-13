import { Db, Collection, MongoClient, ObjectId } from 'mongodb'
import { DbProduct } from '../product/product-api'
import { getPreloadProducts } from './reset-app-db'
import { Order } from '../order/order-api'

const PRODUCTS_COLLECTION = 'products'
const ORDERS_COLLECTION = 'orders'
export const PRODUCT_DB = 'product-db'

// TODO: move this interface to products api
export interface ProductDatabase {
  // quit(): void
  flushDb(): Promise<boolean>

  createOrder(order: Order, userId: string): Promise<boolean>
  getOrdersById(userId: string): Promise<Order[]>
  getAllOrders(): Promise<Order[]>

  saveAllProducts(products: DbProduct[]): Promise<boolean>
  resetAllProducts(): Promise<boolean>
  saveProduct(product: DbProduct, productId: string): Promise<boolean>
  createProduct(product: DbProduct): Promise<boolean>
  getAllProducts(): Promise<DbProduct[]>
  getProductById(productId: string): Promise<DbProduct | null>
}

export class MongoProductDatabase implements ProductDatabase {
  private db: Db
  private productsCollection: Collection<DbProduct>
  private ordersCollection: Collection<Order>

  constructor(private client: MongoClient, dbName: string) {
    console.log('Instance of mongo product database class created.')
    this.db = this.client.db(dbName)
    this.productsCollection = this.db.collection(PRODUCTS_COLLECTION)
    this.ordersCollection = this.db.collection(ORDERS_COLLECTION)
  }

  flushDb() {
    const flushes = [this.ordersCollection.deleteMany({}), this.productsCollection.deleteMany({})]
    return Promise.all(flushes).then(results => {
      const success = !!results[0].result.ok
      console.log(`Database flushed`)
      return success
    })
  }

  createOrder(order: Order, userId: string): Promise<boolean> {
    order.userId = userId
    return this.ordersCollection.insertOne(order).then(result => result.insertedCount === 1)
  }

  getOrdersById(userId: string): Promise<Order[]> {
    return this.ordersCollection.find({ userId }).toArray()
  }

  getAllOrders(): Promise<Order[]> {
    return this.ordersCollection.find({}).toArray()
  }

  saveAllProducts(products: DbProduct[]): Promise<boolean> {
    return this.productsCollection.deleteMany({}).then(_result => {
      if (!!_result.deletedCount) {
        return this.productsCollection.insertMany(products).then(result => {
          return result.insertedCount === products.length
        })
      } else {
        return false
      }
    })
  }

  resetAllProducts(): Promise<boolean> {
    const resets = [this.saveAllProducts(getPreloadProducts())]
    return Promise.all(resets).then(results => results.every(r => r))
  }

  saveProduct(product: DbProduct, productId: string): Promise<boolean> {
    return this.productsCollection
      .replaceOne({ _id: new ObjectId(productId) }, product)
      .then(result => result.modifiedCount === 1)
  }

  createProduct(product: DbProduct): Promise<boolean> {
    return this.productsCollection.insertOne(product).then(result => result.insertedCount === 1)
  }

  getAllProducts(): Promise<DbProduct[]> {
    return this.productsCollection.find({}).toArray()
    // .then(xs => xs.filter(x => !!x))
  }

  getProductById(productId: string): Promise<DbProduct | null> {
    return this.productsCollection.findOne({ _id: new ObjectId(productId) })
  }
}