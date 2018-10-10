import { Db, Collection, MongoClient, ObjectId } from 'mongodb'

import { UserWoId, User, UserWithPwdDigest } from '../auth/models/user'
// import { serverConfig } from '../server-config'
import { DbProduct, Categories, Category } from '../product/product-api'
import { getPreloadProducts, categoriesPreload } from './reset-app-db'
import { Order } from '../order/order-api'

// export const USERS = 'users'
// export const USER_EMAIL = 'user:email'

// function scrubNulls<T>(arr: T[]): T[] {
//   return arr.filter(x => !!x)
// }

// FIXME: align with the front endianness
// TODO: consider moving categories to a sepearte database object
interface DbUserWoId extends UserWoId {
  passwordDigest: string
}

interface DbUser extends DbUserWoId {
  _id?: ObjectId
}

interface DbCategory extends Category {
  _id: string
}

function addUserId(dbUser: DbUser | null): User | null {
  if (!dbUser) {
    return null
  }
  const _id = dbUser._id ? dbUser._id.toHexString() : 'id missing in dbUser'
  return {
    _id,
    email: dbUser.email,
    userName: dbUser.userName,
    roles: dbUser.roles,
    avatarUrl: dbUser.avatarUrl
  }
}

const USER_COLLECTION = 'users'
const CATEGORIES_COLLECTION = 'categories'
const PRODUCTS_COLLECTION = 'products'
const ORDERS_COLLECTION = 'orders'

// TODO: Move this to a central place such as server.config
// TODO: Fix redis database to work with this interface - maybe
export interface Database {
  // quit(): void
  flushDb(): Promise<boolean>

  createOrder(order: Order, userId: string): Promise<boolean>
  getOrdersById(userId: string): Promise<Order[]>
  getAllOrders(): Promise<Order[]>

  saveAllCategories(cats: Categories): Promise<boolean>
  getAllCategories(): Promise<Categories>

  saveAllProducts(products: DbProduct[]): Promise<boolean>
  resetAllProducts(): Promise<boolean>
  saveProduct(product: DbProduct, productId: string): Promise<boolean>
  createProduct(product: DbProduct): Promise<boolean>
  getAllProducts(): Promise<DbProduct[]>
  getProductById(productId: string): Promise<DbProduct | null>

  getUserById(userId: string): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  // TODO: consider moving passwords into its own collection - I think this is a good idea
  getUserPwdDigest(email: string): Promise<string | null>
  // getUserWithPwd(email: string): Promise<UserWithPwdDigest | null>
  getAllUsers(): Promise<UserWoId[]>
  createUser(dbUser: UserWithPwdDigest): Promise<boolean>
  deleteUser(email: string): Promise<boolean>
}

export class MongoDatabase implements Database {
  private db: Db
  private usersCollection: Collection<DbUser>
  private categoriesCollection: Collection<DbCategory>
  private productsCollection: Collection<DbProduct>
  private ordersCollection: Collection<Order>

  constructor(private client: MongoClient, dbName: string) {
    console.log('Instance of mongo database class created.')
    this.db = this.client.db(dbName)
    this.usersCollection = this.db.collection<DbUser>(USER_COLLECTION)
    this.categoriesCollection = this.db.collection(CATEGORIES_COLLECTION)
    this.productsCollection = this.db.collection(PRODUCTS_COLLECTION)
    this.ordersCollection = this.db.collection(ORDERS_COLLECTION)
    // TODO: Do these events happen?
    this.db.on('error', err => {
      // Can I reconnect here?
      console.error(`Error in client: ${err} Can I reconnect?`)
    })
    this.db.on('connect', _e => {
      console.log(`Database ${dbName} connected`)
    })
    this.db.on('reconnecting', _e => {
      console.log(`Attempting reconnect`)
    })
    this._createIndexes()
  }

  private _createIndexes() {
    this.usersCollection.createIndexes([{ key: { email: -1 }, unique: true }]).then(result => {
      if (!result.ok) console.log(`Indexes ok: ${result.ok}`)
    })
  }

  // quit() {
  //   return this.client.close(() => console.log(`App Mongo client closed`))
  // }

  flushDb() {
    const flushes = [
      this.usersCollection.deleteMany({}),
      this.categoriesCollection.deleteMany({}),
      this.productsCollection.deleteMany({})
    ]
    return Promise.all(flushes).then(results => {
      const success = !!results[0].result.ok
      console.log(`Database flushed`)
      return success
    })
  }

  getShoppingCartById(_id: string) {
    return Promise.resolve(null)
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

  saveAllCategories(cats: Categories): Promise<boolean> {
    const catsArray: DbCategory[] = Object.keys(cats).map(key => ({
      _id: key,
      ...cats[key]
    }))
    return this.categoriesCollection
      .deleteMany({})
      .then(() => {
        // return this.categoriesCollection.updateMany({}, catsArray, { upsert: true })
        return this.categoriesCollection.insertMany(catsArray)
      })
      .then(result => {
        return result.insertedCount === catsArray.length
      })
  }

  getAllCategories(): Promise<Categories> {
    return this.categoriesCollection
      .find({})
      .toArray()
      .then(cats => {
        const categories: Categories = {}
        cats.forEach(cat => (categories[cat.key] = cat))
        return categories
      })
  }

  saveAllProducts(products: DbProduct[]): Promise<boolean> {
    return this.productsCollection
      .deleteMany({})
      .then(_result => {
        // TODO: verify delete many result
        return this.productsCollection.insertMany(products)
      })
      .then(result => {
        return result.insertedCount === products.length
      })
  }

  resetAllProducts(): Promise<boolean> {
    // FIXME: const host = // NEED TO CONSTRUCT SERVER URL
    // FIXME: probably should wipe out shopping carts
    const resets = [
      this.saveAllProducts(getPreloadProducts()),
      this.saveAllCategories(categoriesPreload)
    ]
    return Promise.all(resets).then(results => results.every(r => r))
  }

  saveProduct(product: DbProduct, productId: string): Promise<boolean> {
    return this.productsCollection
      .updateOne({ _id: new ObjectId(productId) }, product)
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

  getUserById(userId: string): Promise<User | null> {
    return this.usersCollection.findOne({ _id: new ObjectId(userId) }).then(addUserId)
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.usersCollection.findOne({ email }).then(addUserId)
  }

  getUserPwdDigest(email: string): Promise<string | null> {
    return this.usersCollection
      .findOne({ email })
      .then(dbUser => (dbUser ? dbUser.passwordDigest : null))
  }

  getAllUsers(): Promise<User[]> {
    return this.usersCollection
      .find({})
      .toArray()
      .then(users => users.map(addUserId) as User[])
    // .then(xs => xs.filter(x => !!x)) // TODO: verify filter is not needed
  }

  createUser(user: UserWithPwdDigest): Promise<boolean> {
    return this.usersCollection.insertOne(user).then(result => result.insertedCount === 1)
  }

  deleteUser(email: string): Promise<boolean> {
    return this.usersCollection.deleteOne({ email }).then(result => result.deletedCount === 1)
  }
}

// FIXME: put this in the server code
// required by chat server
// export function getAppUserById(id: string): Promise<DbUser> {
//   return redisdb.getUserById(id)
// }
