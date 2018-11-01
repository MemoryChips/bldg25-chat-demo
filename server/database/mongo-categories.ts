import { Db, Collection, MongoClient } from 'mongodb'

import { CategoryDatabase, Category, Categories, CATEGORY_COLLECTION } from '../product/product-api'

interface DbCategory extends Category {
  _id: string
}

export class MongoCategoryDatabase implements CategoryDatabase {
  private db: Db
  private categoryCollection: Collection<Category>

  constructor(private client: MongoClient, dbName: string) {
    console.log('Instance of mongo category database created.')
    this.db = this.client.db(dbName)
    this.categoryCollection = this.db.collection<Category>(CATEGORY_COLLECTION)
  }

  flushDb() {
    const flushes = [this.categoryCollection.deleteMany({})]
    return Promise.all(flushes).then(results => {
      const success = !!results[0].result.ok
      console.log(`Database flushed`)
      return success
    })
  }

  saveAllCategories(cats: Categories): Promise<boolean> {
    const catsArray: DbCategory[] = Object.keys(cats).map(key => ({
      _id: key,
      ...cats[key]
    }))
    return this.categoryCollection
      .deleteMany({})
      .then(deleteResult => {
        if (!deleteResult) {
          console.error(`Failed to delete all categories. Aborting category reset.`)
        } else {
          console.log(`All categories deleted successfully`)
        }
        return this.categoryCollection.insertMany(catsArray)
      })
      .then(insertResult => {
        return insertResult.insertedCount === catsArray.length
      })
  }

  getAllCategories(): Promise<Categories> {
    return this.categoryCollection
      .find({})
      .toArray()
      .then(cats => {
        const categories: Categories = {}
        cats.forEach(cat => (categories[cat.key] = cat))
        return categories
      })
  }
}
