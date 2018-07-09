import { Request, Response } from 'express'
import { redisdb } from '../database/redis'
import { User, DbUser } from './models/user'
import * as argon2 from 'argon2'
import { validatePassword } from './password-validation'
import { createCsrfToken, createSessionToken } from './security'

import { serverConfig } from '../server-config'

// TODO: align with front end
// import { Credentials } from 'app/auth/auth.service'
export interface Credentials {
  userName?: string
  email: string
  password: string
}

// interface Req extends Request {
//   user: any
// }
interface SignUpInfo {
  email: string
  password: string
  userName: string
  avatarUrl?: string
}
export function createUser(req: Request, res: Response) {
  const signUpInfo: SignUpInfo = req.body
  let errors: string[] = []
  errors = validatePassword(signUpInfo.password)
  redisdb.userExists(signUpInfo.email).then(exists => {
    if (exists) {
      errors.push('Email already in use.')
    }
    if (errors.length > 0) {
      res.status(400).json({ errors })
    } else {
      createUserAndSession(res, signUpInfo).catch(err => {
        console.log('Error creating new user', err)
        res.sendStatus(500)
      })
    }
  })
}

export function getJwtUser(req: any, res: any) {
  if (!!req.user) {
    const userId: string = req.user.id
    redisdb
      .getUserById(userId)
      .then(user => {
        const rUser = { id: userId, ...user }
        delete rUser.passwordDigest
        res.status(200).json(rUser)
      })
      .catch(err => {
        res.status(403).json(`Error trying to get jwt user: ${err}`)
      })
  } else {
    res.status(200).json({
      id: undefined,
      email: undefined,
      userName: 'anonymous',
      roles: []
    })
  }
}

export function getUser(req: Request, res: Response) {
  if (req.params.id) {
    const userId = req.params.id
    redisdb.getUserById(userId).then(user => {
      // const rUser = { ...JSON.parse(user) }
      // delete user.passwordDigest
      res.status(200).json(user)
    })
  } else {
    res.status(403).json('Error trying to get user')
  }
}

export function saveUser(req: any, res: any) {
  const userId = req.params.id
  redisdb.getUserById(userId).then(dbUser => {
    const userEmail = dbUser.email
    redisdb
      .deleteUser(userEmail)
      .then(_results => {
        console.log(`Results of deleting old records${_results}`)
        if (_results < 2) {
          createUser(req, res)
        } else {
          res
            .status(403)
            .json({ success: false, reason: 'error deleting old records' })
        }
      })
      .catch(err => {
        res.status(403).json({ success: false, reason: err })
      })
  })
}

async function createUserAndSession(res: Response, signUpInfo: SignUpInfo) {
  const passwordDigest = await argon2.hash(signUpInfo.password)
  const dbUser: DbUser = {
    email: signUpInfo.email,
    userName: signUpInfo.userName,
    passwordDigest,
    roles: ['STUDENT'],
    avatarUrl: signUpInfo.avatarUrl || serverConfig.defaultAvatarUrl
    // avatarUrl: ''
  }
  if (dbUser.email.toLowerCase() === 'robert.tamlyn@gmail.com') {
    dbUser.roles = ['STUDENT', 'ADMIN']
  }
  const userCreated = await redisdb.createUser(dbUser)
  if (userCreated) {
    // const dbUser = await redisdb.getUserByEmail(signUpInfo.email)
    const id = await redisdb.getUserId(signUpInfo.email)
    const user: User = { id, ...dbUser }
    const sessionToken = await createSessionToken(user)
    const csrfToken = await createCsrfToken()
    // res.cookie('SESSIONID', sessionToken, { httpOnly: true, secure: true })
    res.cookie('SESSIONID', sessionToken, { httpOnly: true })
    res.cookie('XSRF-TOKEN', csrfToken)
    res.status(200).json({
      id,
      email: dbUser.email,
      roles: dbUser.roles,
      userName: signUpInfo.userName
    })
  } else {
    console.log(`Unable to create user: ${dbUser.email}`)
    res
      .status(403)
      .json({
        success: false,
        reason: 'unable to create user. Possibly user exists.'
      })
  }
}

export async function login(req: Request, res: Response) {
  const credentials: Credentials = req.body
  const userId = await redisdb.getUserId(credentials.email)
  if (!userId) {
    return res.status(403).send('email not found')
  }

  const dbUser = await redisdb.getUserById(userId)
  if (!dbUser) {
    return res.status(500).send('Server error. User record not found.')
  }
  const user: User = { id: userId, ...dbUser }
  const isPasswordValid = await argon2.verify(
    user.passwordDigest,
    credentials.password
  )
  if (!isPasswordValid) {
    return res.status(403).send('incorrect password')
  }

  const sessionToken = await createSessionToken(user)
  const csrfToken = await createCsrfToken()
  console.log('Login successful')
  const age24hrs = 24 * 60 * 60 * 1000
  res.cookie('SESSIONID', sessionToken, { maxAge: age24hrs, httpOnly: true })
  res.cookie('XSRF-TOKEN', csrfToken)
  res.status(200).json({
    id: user.id,
    email: user.email,
    roles: user.roles,
    userName: user.userName,
    avatarUrl: user.avatarUrl || ''
  })
}

export function logout(_req: Request, res: Response) {
  console.log('Processing logout.')
  res.clearCookie('SESSIONID')
  res.clearCookie('XSRF-TOKEN')
  res.status(200).json({ user: {} })
}
