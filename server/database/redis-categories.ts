// import { Db, Collection, MongoClient } from 'mongodb'
import { RedisClient } from 'redis'
import { CategoryDatabase, Categories, CATEGORY_COLLECTION } from '../product/product-api'

// interface DbCategory extends Category {
//   _id: string
// }

export class RedisCategoryDatabase implements CategoryDatabase {
  constructor(private client: RedisClient) {
    console.log('Instance of redis category database created.')
    // TODO: move this reconnect stuff to server.ts
  }

  private getItem(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (_err, item) => {
        if (_err) reject(_err)
        resolve(item)
      })
    })
  }

  private setItem(key: string, value: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, (_err, _ok) => {
        if (_err) reject(_err)
        resolve(true)
      })
    })
  }

  saveAllCategories(cats: Categories): Promise<boolean> {
    return this.setItem(CATEGORY_COLLECTION, JSON.stringify(cats))
  }

  getAllCategories(): Promise<Categories> {
    return this.getItem(CATEGORY_COLLECTION).then((sCats: string) => JSON.parse(sCats))
  }
}
