const util = require('util')
const crypto = require('crypto')
import * as jwt from 'jsonwebtoken'
import * as fs from 'fs'
import { User } from './models/user'

export const randomBytes = util.promisify(crypto.randomBytes)

export const signJwt = util.promisify(jwt.sign)

const RSA_PRIVATE_KEY = fs.readFileSync('./server/keys/private.key')
const RSA_PUBLIC_KEY = fs.readFileSync('./server/keys/public.key')
const SESSION_DURATION = 7200

export async function createSessionToken(user: User) {
  return signJwt({
    roles: user.roles
  },
    RSA_PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: SESSION_DURATION,
      subject: user.id.toString()
    })
}

export async function decodeJwt(token: string) {
  const payload = await jwt.verify(token, RSA_PUBLIC_KEY)
  console.log('decoded JWT payload', payload)
  return payload
}

export async function createCsrfToken() {
  const token = await randomBytes(32).then(bytes => bytes.toString('hex'))
  return token
}
