import { Request, Response } from 'express'
import { User, SignUpInfo, Credentials, UserWoId } from './models/user'
import argon2 from 'argon2'
import { validatePassword } from './password-validation'
import { createCsrfToken, createSessionToken } from './security'

import { serverConfig } from '../server-config'

import { TOKEN_AGE_MS } from '../server-config'
import { UserDatabase, USER_DB } from '../database/mongo-users'

import { ChatDatabase } from 'bldg25-chat-server'

export function createUser(req: Request, res: Response) {
  const db: UserDatabase = req.app.locals[USER_DB]
  const signUpInfo: SignUpInfo = req.body
  const errors: string[] = validatePassword(signUpInfo.password)
  db.getUserByEmail(signUpInfo.email).then(dbUser => {
    if (dbUser) {
      errors.push('Email already in use.')
    }
    if (errors.length > 0) {
      res.status(400).json({ errors })
    } else {
      createUserAndSession(req, res, signUpInfo).catch(err => {
        console.log('Error creating new user', err)
        res.sendStatus(500)
      })
    }
  })
}

export function getJwtUser(req: Request, res: Response) {
  const userNotFound = {
    _id: undefined,
    email: undefined,
    userName: 'anonymous'
  }
  const jwtUser: User = res.locals.user
  if (!!jwtUser) {
    const db: UserDatabase = req.app.locals[USER_DB]
    db.getUserById(jwtUser._id)
      .then(user => {
        if (!user) return res.status(403).json(userNotFound)
        res.status(200).json(user)
      })
      .catch(err => {
        res.status(403).json(`Error trying to get jwt user: ${err}`)
      })
  } else {
    res.status(200).json(userNotFound)
  }
}

export function getUser(req: Request, res: Response) {
  const db: UserDatabase = req.app.locals[USER_DB]
  if (req.params._id) {
    const userId = req.params._id
    db.getUserById(userId).then(user => {
      if (!user) return res.status(403).json({ error: `User with id: ${userId} not found` })
      res.status(200).json(user)
    })
  } else {
    res.status(403).json('Error trying to get user')
  }
}

export function deleteUser(req: any, res: Response) {
  const db: UserDatabase = req.app.locals[USER_DB]
  const email = req.params.email
  db.deleteUser(email).then(success => {
    if (success) {
      res.status(200).json({ success, reason: `user with email ${email} deleted` })
    } else {
      res
        .status(403)
        .json({ success, reason: `user with email ${email} not found and not deleted` })
    }
  })
}

async function createUserAndSession(req: Request, res: Response, signUpInfo: SignUpInfo) {
  const db: UserDatabase = req.app.locals[USER_DB]
  const chatDb: ChatDatabase = req.app.locals.CHAT_DB // optionally to allow chat user sign up at user signup
  const passwordDigest = await argon2.hash(signUpInfo.password)
  const user: UserWoId = {
    email: signUpInfo.email,
    userName: signUpInfo.userName,
    roles: ['STUDENT'],
    avatarUrl: signUpInfo.avatarUrl || serverConfig.defaultAvatarUrl
    // avatarUrl: ''
  }
  if (user.email.toLowerCase() === 'robert.tamlyn@gmail.com') {
    user.roles = ['STUDENT', 'ADMIN']
  }
  const success = await db.createUser(user, passwordDigest)
  if (success) {
    // const dbUser = await redisdb.getUserByEmail(signUpInfo.email)
    const newUser = await db.getUserByEmail(signUpInfo.email)
    if (!newUser) {
      return res.status(500).json(`Server error while creating user: ${signUpInfo.email}`)
    }
    //
    // Optionally create chat user at the same time as creating a user
    //
    const chatUser = await chatDb.getUserOrCreate({
      // required prop
      appId: newUser._id,
      email: newUser.email,
      // optional prop
      avatarUrl: newUser.avatarUrl || '',
      userName: newUser.userName || newUser.email
    })
    if (chatUser) {
      console.log(
        `Created chat user with app user: ${chatUser.userName} with avatar: ${chatUser.avatarUrl}`
      )
    }
    //
    // end of optional create user
    //
    sendSuccess(res, newUser)
  } else {
    console.log(`Unable to create user: ${user.email}`)
    res.status(403).json({
      success: false,
      reason: 'unable to create user. Possibly user exists.'
    })
  }
}

async function sendSuccess(res: Response, user: User) {
  const sessionToken = await createSessionToken(user)
  const csrfToken = await createCsrfToken()
  // res.cookie('SESSIONID', sessionToken, { httpOnly: true, secure: true })
  res.cookie('SESSIONID', sessionToken, { maxAge: TOKEN_AGE_MS, httpOnly: true })
  res.cookie('XSRF-TOKEN', csrfToken)
  res.status(200).json(user)
}

export async function login(req: Request, res: Response) {
  const db: UserDatabase = req.app.locals[USER_DB]
  const credentials: Credentials = req.body
  const userPwdDigest = await db.getUserPwdDigest(credentials.email)
  if (!userPwdDigest) {
    return res.status(403).send(`User password digest with email ${credentials.email} not found`)
  }
  const isPasswordValid = await argon2.verify(userPwdDigest, credentials.password)
  if (!isPasswordValid) {
    return res.status(403).send('incorrect password')
  }
  const user = await db.getUserByEmail(credentials.email)
  if (user) sendSuccess(res, user)
  else res.status(403).send(`User with email ${credentials.email} not found`)
  // const sessionToken = await createSessionToken(userWithPwd)
  // const csrfToken = await createCsrfToken()
  // console.log('Login successful')
  // res.cookie('SESSIONID', sessionToken, {
  //   maxAge: TOKEN_AGE_MS,
  //   httpOnly: true
  // })
  // res.cookie('XSRF-TOKEN', csrfToken)
  // res.status(200).json({
  //   _id: userWithPwd._id,
  //   email: userWithPwd.email,
  //   roles: userWithPwd.roles,
  //   userName: userWithPwd.userName,
  //   avatarUrl: userWithPwd.avatarUrl || ''
  // })
}

export function logout(_req: Request, res: Response) {
  console.log('Processing logout.')
  res.clearCookie('SESSIONID')
  res.clearCookie('XSRF-TOKEN')
  res.status(200).json({ user: {} })
}
