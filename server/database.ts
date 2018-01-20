import {
  USERS, PRODUCTS, CATEGORIES, DbUser, User, DbProduct,
  CARTS, DbShoppingCart, Item,
} from './database-data'

function values <T> (obj: {[key: string]: T}): T[] {
  return Object.keys(obj).map(key => obj[key])
}

function keyBy <T> (arr: T[], keyString: string): {[key: string]: T} {
  return arr.reduce(function (acc, curr) {
    const key = curr[keyString]
    if (key) {acc[key] = curr}
    return acc
  }, {})
}

function isDbProduct(item: any): item is DbProduct {
  return typeof item.title === 'string' &&
    typeof item.imageUrl === 'string' &&
    typeof item.category === 'string' &&
    typeof item.price === 'number'
}

class InMemoryDatabase {

  userCounter = 2
  cartCounter = Object.keys(CARTS).length
  // cartItemCounter = Object.keys(CARTITEMS).length

  readAllProducts() {
    return PRODUCTS
  }

  createProduct(req, _res, next) {
    const product = req.body
    if (isDbProduct(product)) {
      // create product
    } else {
      // send error response
    }
    next()
  }

  createShoppingCart(): string {
    this.cartCounter++
    const id = this.cartCounter.toString()
    CARTS[id] = { items: {}}
    return id
  }
  getShoppingCart(cartId: string): DbShoppingCart {
    return CARTS[cartId]
  }
  putShoppingCartItem(cartId: string, item: Item, itemId: string): boolean {
    this.getShoppingCart(cartId).items[itemId] = item
    return true
  }
  deleteShoppingCart(cartId: string): string {
    delete CARTS[cartId]
    return this.createShoppingCart()
  }
  deleteShoppingCartItem(cartId: string, itemId: string): boolean {
    const cart = this.getShoppingCart(cartId)
    if (cart.items[itemId]) {return delete cart.items[itemId]}
    return false
  }
  // updateShoppingCartItem(product: DbProduct, quantity: number): string {
  //   this.cartItemCounter++
  //   const id = this.cartItemCounter.toString()
  //   CARTITEMS[id] = { product, quantity }
  //   return id
  // }
  getShoppingCartItem(cartId: string, itemId: string): Item {
    return this.getShoppingCart(cartId).items[itemId]
  }

  readAllCategories() {
    return CATEGORIES
  }

  // createUser(email: string, passwordDigest: string): User {
  createUser(newUser: any, passwordDigest: string): User {
    const usersPerEmail = keyBy(values<DbUser>(USERS), 'email')
    if (usersPerEmail[newUser.email]) {
      const message = 'A user already exists with email ' + newUser.email
      console.error(message)
      throw new Error(message)
    }
    this.userCounter++
    const id = this.userCounter.toString()
    const newDbUser: DbUser = {
      email: newUser.email,
      userName: newUser.userName,
      passwordDigest,
      roles: ['STUDENT']
    }
    USERS[id] = newDbUser
    console.log(USERS)
    return { id, ...newDbUser }
  }

  saveUser(dbUser: DbUser): string {
    this.userCounter++
    const id = this.userCounter.toString()
    USERS[id] = dbUser
    console.log(USERS)
    return id
  }

  findUserByEmail(email: string): User {
    console.log('Finding user by email:', email)
    const id = Object.keys(USERS).find(k => USERS[k].email === email)
    const user = { id, ...USERS[id] }
    console.log('user retrieved:', user)
    return user
  }

  // findUserByEmail(email: string): User {
  //   console.log('Finding user by email:', email)
  //   const users = values<DbUser>(USERS)
  //   // const user = _.find(users, u => u.email === email)
  //   const dbUser = users.find( u => u.email === email)
  //   console.log('user retrieved:', dbUser)
  //   return {id: 'anId', ...dbUser}
  // }

  findUserById(id: string): User {
    console.log('looking for userId ', id)
    if (USERS[id]) {
      return { id, ...USERS[id] }
    }
    return undefined
  }
}

//   findUserById(userId: string): DbUser {
//     let user
//     if (userId) {
//       console.log('looking for userId ', userId)
//       // const users = values<DbUser>(USERS)
//       user = USERS[userId]
//       console.log('user data found:', user)
//     }
//     return user
//   }
// }

export const db = new InMemoryDatabase()
