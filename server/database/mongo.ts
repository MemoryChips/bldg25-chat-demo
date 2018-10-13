import { Db, Collection, MongoClient, ObjectId } from 'mongodb'
import { UserWoId, User, UserWithPwdDigest } from '../auth/models/user'

interface DbUser extends UserWithPwdDigest {
  _id?: ObjectId
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

export interface Database {
  // quit(): void
  flushDb(): Promise<boolean>

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

  constructor(private client: MongoClient, dbName: string) {
    console.log('Instance of mongo database class created.')
    this.db = this.client.db(dbName)
    this.usersCollection = this.db.collection<DbUser>(USER_COLLECTION)
    this._createIndexes()
  }

  private _createIndexes() {
    this.usersCollection.createIndexes([{ key: { email: -1 }, unique: true }]).then(result => {
      if (!result.ok) console.log(`Indexes ok: ${result.ok}`)
    })
  }

  flushDb() {
    const flushes = [this.usersCollection.deleteMany({})]
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
    return this.usersCollection
      .findOne({ email })
      .then(dbUser => (dbUser ? dbUser.passwordDigest : null))
  }

  getAllUsers(): Promise<User[]> {
    return this.usersCollection
      .find({})
      .toArray()
      .then(users => users.map(addUserId) as User[])
  }

  createUser(user: UserWithPwdDigest): Promise<boolean> {
    return this.usersCollection.insertOne(user).then(result => result.insertedCount === 1)
  }

  deleteUser(email: string): Promise<boolean> {
    return this.usersCollection.deleteOne({ email }).then(result => result.deletedCount === 1)
  }
}
