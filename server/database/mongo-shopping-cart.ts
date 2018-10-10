import { Db, Collection, MongoClient, ObjectId } from 'mongodb'

import {
  ShoppingCartDatabase,
  ICart,
  SHOPPING_CART_COLLECTION
} from '../shopping-cart/shopping-cart-api'

export class MongoShoppingCartDatabase implements ShoppingCartDatabase {
  private db: Db
  private shoppingCartCollection: Collection<ICart>

  constructor(private client: MongoClient, dbName: string) {
    console.log('Instance of mongo database class created.')
    this.db = this.client.db(dbName)
    this.shoppingCartCollection = this.db.collection<ICart>(SHOPPING_CART_COLLECTION)
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
    this.shoppingCartCollection
      .createIndexes([{ key: { email: -1 }, unique: true }])
      .then(result => {
        if (!result.ok) console.log(`Indexes ok: ${result.ok}`)
      })
  }

  quit() {
    return this.client.close(() => console.log(`App Mongo client closed`))
  }

  clearAllCarts() {
    const flushes = [this.shoppingCartCollection.deleteMany({})]
    return Promise.all(flushes).then(results => {
      const success = !!results[0].result.ok
      console.log(`Database flushed`)
      return success
    })
  }
  getShoppingCart(_id: string): Promise<ICart | null> {
    return this.shoppingCartCollection.findOne({ _id: new ObjectId(_id) })
  }
  createShoppingCart(): Promise<string> {
    const newCart: ICart = {
      items: {},
      productIds: []
    }
    return this.shoppingCartCollection
      .insertOne(newCart)
      .then(result => result.insertedId.toHexString())
  }
  saveShoppingCart(cart: ICart, cartId: string): Promise<boolean> {
    return this.shoppingCartCollection
      .replaceOne({ _id: new ObjectId(cartId) }, cart)
      .then(result => result.modifiedCount === 1)
  }
  deleteShoppingCart(cartId: string): Promise<boolean> {
    return this.shoppingCartCollection
      .deleteOne({ _id: cartId })
      .then(result => result.deletedCount === 1)
  }
}
