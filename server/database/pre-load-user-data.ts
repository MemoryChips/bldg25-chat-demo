// tslint:disable:max-line-length

import { redisdb } from './redis'

import { DbUser } from '../auth/models/user'

export interface KeyedObj<T> {
  [key: string]: T
}

const catUrl = 'http://localhost:9001/image-files/cat.jpg'
const dogUrl = 'http://localhost:9001/image-files/dog.jpg'

// Password10
const passwordDigest =
  '$argon2i$v=19$m=4096,t=3,p=1$EAOnDLilKQyKF3lDVxiSoA$YQfnRYqxh62mwk5Qo1EmSZyNcrP6G+ZcYPpFKM690AI'
const users: DbUser[] = [
  {
    email: 'student@gmail.com',
    userName: 'MsStudent',
    passwordDigest,
    roles: ['STUDENT'],
    avatarUrl: dogUrl
  },
  {
    email: 'admin@gmail.com',
    userName: 'MrAdmin',
    passwordDigest,
    roles: ['STUDENT', 'ADMIN']
  },
  {
    userName: 'Rob',
    roles: ['STUDENT'],
    email: 'rob@rob.com',
    passwordDigest,
    avatarUrl: catUrl
  },
  {
    email: 'Heath44@hotmail.com',
    roles: ['STUDENT'],
    userName: 'Aaron Moore',
    passwordDigest
  },
  {
    email: 'Gideon9@yahoo.com',
    roles: ['STUDENT'],
    userName: 'Yvonne Conroy Mrs.',
    passwordDigest
  },
  {
    email: 'Laney_Huels@hotmail.com',
    roles: ['STUDENT'],
    userName: 'Laron Padberg',
    passwordDigest
  },
  {
    email: 'Aletha.Labadie@hotmail.com',
    roles: ['STUDENT'],
    userName: 'Dr. Maryam Spinka',
    passwordDigest
  },
  {
    email: 'Rogelio24@hotmail.com',
    roles: ['STUDENT'],
    userName: 'Kiley Baumbach',
    passwordDigest
  },
  {
    email: 'Yazmin.Heidenreich97@gmail.com',
    roles: ['STUDENT'],
    userName: 'Hollis MacGyver',
    passwordDigest
  },
  {
    email: 'Deon_Heaney@gmail.com',
    roles: ['STUDENT'],
    userName: 'Axel McLaughlin',
    passwordDigest
  }
]

const victim = 'Deon_Heaney@gmail.com'
redisdb.flushDb().then(result => {
  console.log(result)
  const userCreates = users.map(dbUser => redisdb.createUser(dbUser))
  Promise.all(userCreates)
    .then(_results => {
      console.log('users loaded: ', _results)
      return redisdb.deleteUser(victim)
    })
    .then(number => {
      console.log(`Number of user records for ${victim} deleted: ${number}`)
      return number
    })
    .then(_number => {
      return redisdb.getUserByEmail('rob@rob.com')
    })
    .then(user => {
      console.log('Found rob: ', user)
      redisdb.quit()
    })
    .catch(err => {
      console.log(`not all users loaded: ${err}`)
      redisdb.quit()
    })
})
