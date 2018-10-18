import { Db, Collection, MongoClient, ObjectId } from 'mongodb'
import { UserWoId, User } from '../auth/models/user'

interface DbUser extends UserWoId {
  _id?: ObjectId
}

interface Password {
  email: string
  passwordDigest: string
}

function addUserId(dbUser: DbUser | null): User | null {
  if (!dbUser) {
    return null
  }
  const _id = dbUser._id ? dbUser._id.toHexString() : 'id missing in dbUser'
  return { ...dbUser, _id }
}

export const USER_DB = 'user-db'
const USER_COLLECTION = 'users'
const PASSWORD_COLLECTION = 'passwords'

export interface UserDatabase {
  flushDb(): Promise<boolean>

  getUserById(userId: string): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  getUserPwdDigest(email: string): Promise<string | null>
  getAllUsers(): Promise<UserWoId[]>
  createUser(userWoId: UserWoId, passwordDigest: string): Promise<boolean>
  deleteUser(email: string): Promise<boolean>
}

export class MongoUserDatabase implements UserDatabase {
  private db: Db
  private usersCollection: Collection<DbUser>
  private passwordsCollection: Collection<Password>

  constructor(private client: MongoClient, dbName: string) {
    console.log('Instance of mongo user database class created.')
    this.db = this.client.db(dbName)
    this.usersCollection = this.db.collection<DbUser>(USER_COLLECTION)
    this.passwordsCollection = this.db.collection<Password>(PASSWORD_COLLECTION)
    this._createIndexes()
  }

  private _createIndexes() {
    this.usersCollection.createIndexes([{ key: { email: -1 }, unique: true }]).then(result => {
      if (!result.ok) console.log(`Indexes created for users ok: ${result.ok}`)
    })
    this.passwordsCollection.createIndexes([{ key: { email: -1 }, unique: true }]).then(result => {
      if (!result.ok) console.log(`Index created for passwords ok: ${result.ok}`)
    })
  }

  flushDb() {
    const flushes = [this.usersCollection.deleteMany({}), this.passwordsCollection.deleteMany({})]
    return Promise.all(flushes).then(results => {
      const success = !!results[0].result.ok
      console.log(`Database flushed`)
      return success
    })
  }

  getUserById(userId: string): Promise<User | null> {
    return this.usersCollection.findOne({ _id: new ObjectId(userId) }).then(addUserId)
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.usersCollection.findOne({ email }).then(addUserId)
  }

  getUserPwdDigest(email: string): Promise<string | null> {
    return this.passwordsCollection
      .findOne({ email })
      .then(password => (password ? password.passwordDigest : null))
  }

  getAllUsers(): Promise<User[]> {
    return this.usersCollection
      .find({})
      .toArray()
      .then(users => users.map(addUserId) as User[])
  }

  createUser(userWoId: UserWoId, passwordDigest: string): Promise<boolean> {
    return Promise.all([
      this.usersCollection.insertOne(userWoId).then(insertResult),
      this.passwordsCollection
        .insertOne({ email: userWoId.email, passwordDigest })
        .then(insertResult)
    ]).then(results => results.every(r => r))
  }

  // createUser(user: UserWithPwdDigest): Promise<boolean> {
  //   return this.usersCollection.insertOne(user).then(result => result.insertedCount === 1)
  // }

  deleteUser(email: string): Promise<boolean> {
    return Promise.all([
      this.usersCollection.deleteOne({ email }),
      this.passwordsCollection.deleteOne({ email })
    ]).then(results => results.every(r => r.deletedCount === 1))
  }
}

function insertResult(result: any) {
  return result.insertedCount === 1
}
