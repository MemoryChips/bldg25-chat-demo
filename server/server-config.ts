import { defaultVerifyClient } from './auth/security' // *** verifies client credentials
import { IChatConfig } from 'bldg25-chat-server'

const host = process.env.HOST_URL || 'localhost'
// FIXME: fix up these two lines they are hokey
const port = process.env.PORT || 9000
const chatServerPort = Number(process.env.PORT || '9000')
// const redisDbAuthCode =
//   process.env.REDIS_DB_AUTHCODE || 'this_should_be_a_secret_authcode'
// auth 63cf95b9b1a52f2fe6d0a9c5a67fa527
const redisDbAuthCode =
  process.env.REDIS_DB_AUTHCODE || '63cf95b9b1a52f2fe6d0a9c5a67fa527'

// configuration of chat server and redisdb server used by the chat server
export const chatConfig: IChatConfig = {
  redisUrl: host, // *** set this to the url of the chat redis server
  redisPort: 6379, // *** set this to the port of the chat redis server
  redisDataBase: 1, // *** set this to the redis database number to be used by the chat server
  chatServerHost: host, // *** set this to the url of the server
  chatServerPort, // *** set this to the port of the server
  verifyClient: defaultVerifyClient,
  // verifyClient,
  redisDbAuthCode
}

const imageFilePort = process.env.PROD ? port : 4200
const defaultAvatarUrl = `http://${host}:${imageFilePort}/assets/default-gravatar.jpg`
console.log(`default avatar url: ${defaultAvatarUrl}`)

const commandLineArgs = require('command-line-args')
const optionDefinitions = [
  { name: 'secure', type: Boolean },
  { name: 'prod', type: Boolean },
  { name: 'dbHost', type: String },
  { name: 'dbPort', type: Number }
]
export const options = commandLineArgs(optionDefinitions)
console.log(`${Object.keys(options).length}`)
// redis - cli - u redis://redistogo@catfish.redistogo.com:9782
// auth 63cf95b9b1a52f2fe6d0a9c5a67fa527
const dbHost = !!options.dbHost ? options.dbHost : 'catfish.redistogo.com'
const dbPort = !!options.dbPort ? options.dbPort : 9782
// const dbHost = !!options.dbHost ? options.dbHost : 'localhost'
// const dbPort = !!options.dbPort ? options.dbPort : 6379
console.log(`Using ${dbHost}:${dbPort} for redis database`)
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
  prod: !!options.secure
}
