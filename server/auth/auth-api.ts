import { Request, Response } from 'express'
import { redisdb } from '../database/redis'
import { User, DbUser } from './models/user'
import * as argon2 from 'argon2'
import { validatePassword } from './password-validation'
import { createCsrfToken, createSessionToken } from './security'
import { Credentials } from 'app/auth/auth.service'

interface Req extends Request {
  user: any
}
interface SignUpInfo {
  email: string
  password: string
  userName: string
}
export function createUser(req: Request, res: Response) {
  const signUpInfo: SignUpInfo = req.body
  let errors = []
  errors = validatePassword(signUpInfo.password)
  redisdb.keyExists(`user:email:${signUpInfo.email}`).then(exists => {
    if (exists) { errors.push('Email already in use.') }
    if (errors.length > 0) {
      res.status(400).json({ errors })
    } else {
      createUserAndSession(res, signUpInfo)
        .catch((err) => {
          console.log('Error creating new user', err)
          res.sendStatus(500)
        })
    }
  })
}

export function getJwtUser(req: Req, res: Response) {
  if (req.user) {
    const userId = req.user.sub
    redisdb.getItem(`user:${userId}`).then(user => {
      const rUser = { id: userId, ...JSON.parse(user) }
      delete rUser.passwordDigest
      res.status(200).json(rUser)
    }).catch(err => {
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
    redisdb.getItem(`user:${userId}`).then(user => {
      const rUser = { ...JSON.parse(user) }
      delete rUser.passwordDigest
      res.status(200).json(rUser)
    })
  } else {
    res.status(403).json('Error trying to get user')
  }
}

export function saveUser(req: Req, res: Response) {
  const userId = req.params.id
  redisdb.getItem(`user:${userId}`).then(sUser => {
    const userEmail = JSON.parse(sUser).email
    const pDelEmailIndex = redisdb.deleteItem(`user:email:${userEmail}`)
    const pDelUser = redisdb.deleteItem(`user:${userId}`)
    Promise.all([pDelEmailIndex, pDelUser]).then((_results) => {
      console.log(`Results of deleteing old records${_results}`)
      const allGood = _results.every(r => r)
      if (allGood) {
        createUser(req, res)
      }
      res.status(403).json({ success: false, reason: 'error deleting old records' })
    }).catch(err => {
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
    roles: ['STUDENT']
  }
  const userId = await redisdb.createItem('user', JSON.stringify(dbUser))
  const emailLink: string = await redisdb.createItem('user:email', userId, dbUser.email)
  console.log('email link created: ', emailLink)
  const user = {
    id: userId,
    ...dbUser
  }
  const sessionToken = await createSessionToken(user)
  const csrfToken = await createCsrfToken()
  // res.cookie('SESSIONID', sessionToken, { httpOnly: true, secure: true })
  res.cookie('SESSIONID', sessionToken, { httpOnly: true })
  res.cookie('XSRF-TOKEN', csrfToken)
  res.status(200).json({ id: userId, email: dbUser.email, roles: dbUser.roles, userName: signUpInfo.userName })
}

export async function login(req: Request, res: Response) {

  const credentials: Credentials = req.body
  const userId = await redisdb.getItem(`user:email:${credentials.email}`)
  if (!userId) { return res.status(403).send('email not found') }

  const sUser = await redisdb.getItem(`user:${userId}`)
  const user: User = { id: userId, ...JSON.parse(sUser) }
  if (!user) { return res.status(500).send('Server error. User record not found.') }

  const isPasswordValid = await argon2.verify(user.passwordDigest, credentials.password)
  if (!isPasswordValid) { return res.status(403).send('incorrect password') }

  const sessionToken = await createSessionToken(user)
  const csrfToken = await createCsrfToken()
  console.log('Login successful')
  res.cookie('SESSIONID', sessionToken, { httpOnly: true })
  res.cookie('XSRF-TOKEN', csrfToken)
  res.status(200).json({ id: user.id, email: user.email, roles: user.roles, userName: user.userName })
}

export function logout(_req: Request, res: Response) {
  console.log('Processing logout.')
  res.clearCookie('SESSIONID')
  res.clearCookie('XSRF-TOKEN')
  res.status(200).json({ user: {} })
}
