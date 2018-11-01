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
    console.log('Instance of mongo shopping cart database created.')
    this.db = this.client.db(dbName)
    this.shoppingCartCollection = this.db.collection<ICart>(SHOPPING_CART_COLLECTION)
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
