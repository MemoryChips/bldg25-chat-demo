// tslint:disable:max-line-length
import { MongoClient } from 'mongodb'
import { Database, MongoDatabase } from './mongo'
import { mongoUrl, mongoDataBase } from '../server-config'

import { UserWoId } from '../auth/models/user'

export interface KeyedObj<T> {
  [key: string]: T
}

const catUrl = 'http://localhost:4200/assets/cat.jpg'
const dogUrl = 'http://localhost:4200/assets/dog.jpg'

// Password10
const passwordDigest =
  '$argon2i$v=19$m=4096,t=3,p=1$EAOnDLilKQyKF3lDVxiSoA$YQfnRYqxh62mwk5Qo1EmSZyNcrP6G+ZcYPpFKM690AI'
const users: UserWoId[] = [
  {
    email: 'student@gmail.com',
    userName: 'MsStudent',
    roles: ['STUDENT'],
    avatarUrl: dogUrl
  },
  {
    email: 'admin@gmail.com',
    userName: 'MrAdmin',
    roles: ['STUDENT', 'ADMIN'],
    avatarUrl: catUrl
  },
  {
    userName: 'Rob',
    roles: ['STUDENT'],
    email: 'rob@rob.com',
    avatarUrl: catUrl
  },
  {
    email: 'Heath44@hotmail.com',
    roles: ['STUDENT'],
    userName: 'Aaron Moore',
    avatarUrl: ''
  },
  {
    email: 'Gideon9@yahoo.com',
    roles: ['STUDENT'],
    userName: 'Yvonne Conroy Mrs.',
    avatarUrl: ''
  },
  {
    email: 'Laney_Huels@hotmail.com',
    roles: ['STUDENT'],
    userName: 'Laron Padberg',
    avatarUrl: ''
  },
  {
    email: 'Aletha.Labadie@hotmail.com',
    roles: ['STUDENT'],
    userName: 'Dr. Maryam Spinka',
    avatarUrl: ''
  },
  {
    email: 'Rogelio24@hotmail.com',
    roles: ['STUDENT'],
    userName: 'Kiley Baumbach',
    avatarUrl: ''
  },
  {
    email: 'Yazmin.Heidenreich97@gmail.com',
    roles: ['STUDENT'],
    userName: 'Hollis MacGyver',
    avatarUrl: ''
  },
  {
    email: 'Deon_Heaney@gmail.com',
    roles: ['STUDENT'],
    userName: 'Axel McLaughlin',
    avatarUrl: ''
  }
]

const victim = 'Deon_Heaney@gmail.com'

MongoClient.connect(
  mongoUrl,
  { useNewUrlParser: true }
)
  .then(client => {
    const db = new MongoDatabase(client, mongoDataBase)
    runPreload(db).then(() => {
      client.close().then(() => {
        console.log(`Mongo client closed`)
      })
    })
  })
  .catch(err => {
    console.log(`Error while connecting: ${err}`)
  })

function runPreload(db: Database) {
  return db.flushDb().then(() => {
    const userCreates = users.map(userWoId => db.createUser({ passwordDigest, ...userWoId }))
    Promise.all(userCreates)
      .then(_results => {
        console.log('users loaded: ', _results)
        return db.deleteUser(victim)
      })
      .then(success => {
        console.log(`${victim} deleted: ${success}`)
        return success
      })
      .then(_number => {
        return db.getUserByEmail('rob@rob.com')
      })
      .then(user => {
        console.log('Found rob: ', user)
        // db.quit()
      })
      .catch(err => {
        console.log(`not all users loaded: ${err}`)
        // db.quit()
      })
  })
}
