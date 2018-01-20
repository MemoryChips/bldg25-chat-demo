import { Request, Response } from 'express'
import { db } from './database'
import { User } from './database-data'
import * as argon2 from 'argon2'
import { validatePassword } from './password-validation'
// import moment = require('moment')
import { createCsrfToken, createSessionToken } from './security.utils'

interface SignUpInfo  {
  email: string
  password: string
  userName: string
}
export function createUser(req: Request, res: Response) {
  const signUpInfo: SignUpInfo = req.body
  // const errors = []
  const errors = validatePassword(signUpInfo.password)
  if (errors.length > 0) {
    res.status(400).json({ errors })
  } else {
    createUserAndSession(res, signUpInfo)
      .catch((err) => {
        console.log('Error creating new user', err)
        res.sendStatus(500)
      })
  }
}

interface Req extends Request {
  user: any
}
export function saveUser(req: Req, res: Response) {
  const user: User = req.user
  console.log('user in request object: ', user)
  res.status(200).json('Not saving yet.')
}

async function createUserAndSession(res: Response, signUpInfo: SignUpInfo) {
  const passwordDigest = await argon2.hash(signUpInfo.password)
  const user = db.createUser(signUpInfo, passwordDigest)
  const sessionToken = await createSessionToken(user)
  const csrfToken = await createCsrfToken()
  // res.cookie('SESSIONID', sessionToken, { httpOnly: true, secure: true })
  res.cookie('SESSIONID', sessionToken, { httpOnly: true })
  res.cookie('XSRF-TOKEN', csrfToken)
  res.status(200).json({ id: user.id, email: user.email, roles: user.roles, userName: signUpInfo.userName })
}
