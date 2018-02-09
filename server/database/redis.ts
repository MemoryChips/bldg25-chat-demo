import * as redis from 'redis'

class RedisDatabase {

  private redisClient: redis.RedisClient

  constructor() {
    console.log('Instance of redis database created.')
    // AUTH bnparXdTcWyvXxkz1CdlEscwXrreNI6Us3IeCdFzFsaLDJ7KYNmVSUkPcpVJ
    this.redisClient = redis.createClient({ host: 'localhost', port: 6379 })
    const authorized = this.redisClient.auth('bnparXdTcWyvXxkz1CdlEscwXrreNI6Us3IeCdFzFsaLDJ7KYNmVSUkPcpVJ')
    console.log(`Authorization attempt: ${authorized}`)
  }

  uniqueId() {
    return Math.random().toString(36).substring(2)
      + (new Date()).getTime().toString(36)
  }

  getCategories(): Promise<string> {
    return this.getItem('categories')
  }

  getItem(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.redisClient.get(key, (_err, item) => {
        if (_err) reject(_err)
        resolve(item)
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

  keyExists(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.redisClient.exists(key, (_err, numkeys) => {
        if (_err) reject(_err)
        resolve(numkeys > 0)
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

  deleteItem(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.redisClient.del(key, (_err, _ok) => {
        if (_err) reject(_err)
        resolve(true)
      })
    })
  }

  createItem(type: string, item = '', uid: string = null): Promise<string> {
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

}

export const redisdb = new RedisDatabase()
