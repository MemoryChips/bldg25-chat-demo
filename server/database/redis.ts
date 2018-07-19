import * as redis from 'redis'
import { DbUser } from '../auth/models/user'
import { serverConfig } from '../server-config'
import { DbProducts, DbProduct, Categories } from '../product/product-api'
import { allProducts } from './reset-app-db'
export const USERS = 'users'
export const USER_EMAIL = 'user:email'

export class RedisDatabase {
  private redisClient: redis.RedisClient

  constructor(dbNum = 0) {
    console.log('Instance of redis database created.')
    this.redisClient = redis.createClient({
      host: serverConfig.db.host,
      port: serverConfig.db.port
    })
    const authorized = this.redisClient.auth(serverConfig.redisDbAuthCode)
    this.redisClient.select(dbNum)
    console.log(`Database ${dbNum} selected with Authorization: ${authorized}`)
  }

  quit() {
    return this.redisClient.quit()
  }

  uniqueId() {
    return (
      Math.random()
        .toString(36)
        .substring(2) + new Date().getTime().toString(36)
    )
  }

  flushDb() {
    return new Promise((resolve, reject) => {
      this.redisClient.flushdb((_err, result) => {
        if (_err) reject(_err)
        console.log(`Resulat of database flush: ${result}`)
        resolve(result)
      })
    })
  }

  saveAllCategories(cats: Categories): Promise<boolean> {
    return this.setItem('categories', JSON.stringify(cats))
  }

  getAllCategories(): Promise<Categories> {
    return this.getItem('categories').then((sCats: string) => JSON.parse(sCats))
  }

  saveAllProducts(products: DbProducts): Promise<boolean> {
    return this.setItem('products', JSON.stringify(products))
  }

  resetAllProducts(): Promise<boolean> {
    // get the all products from the reset-app-db
    // const products = {}
    return this.saveAllProducts(allProducts)
  }

  // FIXME: Implement this
  saveProduct(_product: DbProduct): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      resolve(true)
    })
  }

  getAllProducts(): Promise<DbProducts> {
    return this.getItem('products').then((sProducts: string) =>
      JSON.parse(sProducts)
    )
  }

  getUserById(userId: string): Promise<DbUser> {
    // first check for exists
    return this._userExistsById(userId).then(exists => {
      if (exists) {
        // console.log('user exists')
        return this._getUserById(userId)
      } else {
        throw new Error('User not found')
      }
    })
  }

  private _getUserById(userId: string): Promise<DbUser> {
    return new Promise((resolve, reject) => {
      this.redisClient.hget(USERS, userId, (_err, sUser) => {
        if (_err) reject(_err)
        const rUser: DbUser = JSON.parse(sUser)
        resolve(rUser)
      })
    })
  }

  getUserId(email: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.redisClient.hget(USER_EMAIL, email, (_err, index) => {
        if (_err) return reject(_err)
        resolve(index)
      })
    })
  }

  getUserByEmail(email: string): Promise<DbUser> {
    return new Promise<string>((resolve, reject) => {
      this.redisClient.hget(USER_EMAIL, email, (_err, index) => {
        if (_err) return reject(_err)
        resolve(index)
      })
    }).then((index: string) => {
      return this.getUserById(index)
    })
  }

  private _userExistsById(userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.redisClient.hexists(USERS, userId, (_err, exists) => {
        if (_err) reject(_err)
        if (exists > 1) {
          console.log(`*** ERROR *** multiple email links for ${userId}`)
        }
        resolve(exists > 0)
      })
    })
  }

  userExists(email: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.redisClient.hexists(USER_EMAIL, email, (_err, exists) => {
        if (_err) reject(_err)
        if (exists > 1) {
          console.log(`*** ERROR *** multiple email links for ${email}`)
        }
        resolve(exists > 0)
      })
    })
  }

  getAllUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.redisClient.hgetall(USERS, (_err, sUsers) => {
        if (_err) reject(_err)
        const users: any = {}
        Object.keys(sUsers).forEach(key => {
          users[key] = JSON.parse(sUsers[key])
          delete users[key].passwordDigest
        })
        resolve(users)
      })
    })
  }

  private _deleteEmailIndex(email: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.redisClient.hdel(USER_EMAIL, email, (_err, numDeleted) => {
        if (_err) reject(_err)
        if (numDeleted > 1) {
          console.log(
            `*** WARNING *** deleted multiple email links for ${email}`
          )
        }
        resolve(numDeleted)
      })
    })
  }

  private _deleteUserRecord(index: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.redisClient.hdel(USERS, index, (_err, numDeleted) => {
        if (_err) reject(_err)
        if (numDeleted > 1) {
          console.log(
            `*** ERROR *** deleted multiple user records for ${index}`
          )
        }
        resolve(numDeleted)
      })
    })
  }

  private _createUser(dbUser: DbUser): Promise<boolean> {
    // let createdUserId = ''
    return redisdb
      ._createHashItem(USERS, JSON.stringify(dbUser))
      .then(userId => {
        // createdUserId = userId
        return redisdb._createHashItem(USER_EMAIL, userId, dbUser.email)
      })
      .then(userEmail => {
        // const newDbUser = console.log(dbUser)
        // console.log(createdUserId)
        return userEmail === dbUser.email
      })
  }

  createUser(dbUser: DbUser): Promise<boolean> {
    return this.userExists(dbUser.email).then(exists => {
      if (exists) return false
      else return this._createUser(dbUser)
    })
  }

  deleteUser(email: string): Promise<number> {
    return new Promise<string>((resolve, reject) => {
      this.redisClient.hget(USER_EMAIL, email, (_err, index) => {
        if (_err) return reject(_err)
        this._deleteEmailIndex(email)
        resolve(index)
      })
    }).then((index: string) => {
      return this._deleteUserRecord(index)
        .then(number => number)
        .catch(err => {
          console.log(err)
          return 0
        })
    })
  }

  private _createHashItem(
    type: string,
    value = '',
    uid: string = ''
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!uid) uid = this.uniqueId()
      this.redisClient.hset(type, uid, value, (_err, itemsCreated) => {
        if (_err) reject(_err)
        if (itemsCreated === 1) resolve(uid)
        else {
          console.log('Other than 1 item created: ', itemsCreated)
          reject('not created')
        }
      })
    })
  }

  getItem(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.redisClient.get(key, (_err, item) => {
        if (_err) reject(_err)
        resolve(item)
      })
    })
  }

  setItem(key: string, value: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.redisClient.set(key, value, (_err, _ok) => {
        if (_err) reject(_err)
        resolve(true)
      })
    })
  }

  deleteItem(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.redisClient.del(key, (_err, _ok) => {
        if (_err) reject(_err)
        resolve(true)
      })
    })
  }

  createItem(type: string, item = '', uid: string = ''): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!uid) uid = this.uniqueId()
      const id = `${type}:${uid}`
      this.redisClient.set(id, item, (_err, _item) => {
        // this.redisClient.set(type + ':' + id, '', (_err, _item) => {
        if (_err) reject(_err)
        resolve(uid)
      })
    })
  }

  getOrCreateItem(itemId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.redisClient.get(itemId, (_err, item) => {
        if (_err) reject(_err)
        if (item) {
          resolve(item)
        } else {
          // if item does not exist create the item with given Id
          const newItem = JSON.stringify({})
          return this.redisClient.set(itemId, newItem, (__err, _item) => {
            if (__err) reject(__err)
            resolve(newItem)
          })
        }
      })
    })
  }

  addSetItem(key: string, value: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.redisClient.sadd(key, value, (_err, _ok) => {
        if (_err) reject(_err)
        resolve(true)
      })
    })
  }

  getSmembers(key: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.redisClient.smembers(key, (_err, items) => {
        if (_err) reject(_err)
        else {
          this.redisClient.mget(items, (_err2, mItems) => {
            if (_err2) reject(_err)
            else {
              resolve(mItems)
            }
          })
        }
      })
    })
  }

  getKeys(keyPattern: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.redisClient.keys(keyPattern, (_err, keys) => {
        if (_err) reject(_err)
        resolve(keys)
      })
    })
  }
}

export const redisdb = new RedisDatabase()

// required by chat server
export function getAppUserById(id: string): Promise<DbUser> {
  return redisdb.getUserById(id)
}
