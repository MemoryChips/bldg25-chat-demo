// import { defaultVerifyClient } from './auth/security' // *** verifies client credentials
import { IChatConfig } from 'bldg25-chat-server'

// Command line settings
const commandLineArgs = require('command-line-args')
const optionDefinitions = [
  { name: 'secure', type: Boolean },
  { name: 'prod', type: Boolean },
  { name: 'dbHost', type: String },
  { name: 'dbAuth', type: String },
  { name: 'dbPort', type: Number }
]
export const options = commandLineArgs(optionDefinitions)
console.log(`${Object.keys(options).length}`)
const dbHost = !!options.dbHost ? options.dbHost : 'localhost'
const dbPort = !!options.dbPort ? options.dbPort : 6379
const redisDbAuthCode = !!options.dbAuth
  ? options.dbAuth
  : 'this_should_be_a_secret_authcode'
console.log(`Using ${dbHost}:${dbPort} for redis database`)
console.log(`Using authcode ${redisDbAuthCode} for redis database`)

// heroku host format
// https://stormy-mountain-18015.herokuapp.com

// Environment Settings
const host = process.env.HOST_URL || 'localhost'
const port = process.env.PORT || 9000
const chatServerPort = Number(port)

const imageHttp = options.secure ? 'https' : 'http'
const imageFilePort = process.env.PROD || options.prod ? port : 4200
const defaultAvatarUrl =
  process.env.DEFAULT_AVATAR_URL ||
  `${imageHttp}://${host}:${imageFilePort}/assets/default-gravatar.jpg`
console.log(`default avatar url: ${defaultAvatarUrl}`)

export const chatConfig: IChatConfig = {
  redisUrl: dbHost, // *** set this to the url of the chat redis server
  redisPort: dbPort, // *** set this to the port of the chat redis server
  redisDataBase: 0, // *** set this to the redis database number to be used by the chat server
  // chatServerHost: host, // *** set this to the url of the server
  // chatServerPort, // *** set this to the port of the server
  // verifyClient: defaultVerifyClient,
  redisDbAuthCode
}

export const serverConfig = {
  verbose: true,
  log: console.log,
  host,
  port,
  db: {
    type: 'redis',
    host: dbHost,
    port: dbPort
  },
  chatServerPort,
  redisDbAuthCode,
  defaultAvatarUrl,
  secure: !!options.secure,
  prod: !!options.prod
}

export const TOKEN_AGE_MS = 24 * 60 * 60 * 1000
