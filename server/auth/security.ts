const util = require('util')
const crypto = require('crypto')
import * as jwt from 'jsonwebtoken'
import * as fs from 'fs'
import { User } from './models/user'
import { VerifySocketConnection } from 'bldg25-chat-server'
import { TOKEN_AGE_MS } from '../server-config'

export const randomBytes = util.promisify(crypto.randomBytes)

const RSA_PRIVATE_KEY = process.env.RSA_PRIVATE_KEY || fs.readFileSync('./server/keys/private.key')
const RSA_PUBLIC_KEY = process.env.RSA_PUBLIC_KEY || fs.readFileSync('./server/keys/public.key')

const SESSION_DURATION_SECS = Math.round(TOKEN_AGE_MS / 1000)
console.log(`session duration is set to: ${SESSION_DURATION_SECS}`)

export function createSessionToken(user: User) {
  const rUser = { ...user }
  const options: jwt.SignOptions = {
    algorithm: 'RS256',
    expiresIn: SESSION_DURATION_SECS,
    subject: JSON.stringify(rUser)
  }
  const token = jwt.sign(
    {
      roles: user.roles
    },
    RSA_PRIVATE_KEY,
    options
  )
  return token
}

export async function createCsrfToken() {
  const token = await randomBytes(32).then((bytes: any) => bytes.toString('hex'))
  return token
}

export async function getUserFromJwt(token: string): Promise<User> {
  return new Promise<User>((resolve, reject) => {
    jwt.verify(token, RSA_PUBLIC_KEY, (err, result) => {
      if (err) {
        return reject(err)
      } else {
        if (typeof result === 'string') return reject('Error: recieved string from jwt.verify')
        const decodedToken = result as any
        const timeLeftHrs = (decodedToken.exp - global.Date.now() / 1000) / 3600
        if (timeLeftHrs < 12) {
          console.log(
            `Expiration of ${timeLeftHrs} is less than 12 hrs. Consider reject OR find other way to alert front end.`
          )
          // reject(`Expiration of ${timeLeftHrs} is less than 12 hrs`)
        } else {
          console.log(`Expiration of ${timeLeftHrs} is more than 12 hrs.`)
        }
        const user: User = JSON.parse(decodedToken.sub)
        return resolve(user)
      }
    })
  })
}

/*
  This function must be exported for the chat server to verify socket connection attempts
  The chat server is looking for the user in a jwt that can be decoded and returned by this
  function
*/
export const verifySocketConnection: VerifySocketConnection = function(req: any) {
  const cookies = getCookiesMap(req.headers.cookie)
  const token = cookies.SESSIONID
  if (!token) {
    console.log('jwt is missing in a websocket connection attempt')
    return Promise.reject('jwt is missing in a websocket connection attempt')
  } else {
    // these two properties must be returned to chat
    return getUserFromJwt(token).then(user => ({
      email: user.email,
      appId: user._id
    }))
  }
}

function getCookiesMap(cookiesString: string): { [key: string]: string } {
  if (!cookiesString) {
    return {}
  }
  return cookiesString
    .split(';')
    .map(function(cookieString) {
      return cookieString.trim().split('=')
    })
    .reduce(function(acc: { [key: string]: string }, curr) {
      acc[curr[0]] = curr[1]
      return acc
    }, {})
}
