import { defaultVerifyClient } from './auth/security' // *** verifies client credentials
import { IChatConfig } from 'bldg25-chat-server'

const host = process.env.HOST_URL || 'localhost'
// FIXME: fix up these two lines they are hokey
const port = process.env.PORT || 9000
const chatServerPort = Number(process.env.PORT || '9000')
const redisDbAuthCode =
  process.env.REDIS_DB_AUTHCODE || 'this_should_be_a_secret_authcode'

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
// const defaultAvatarUrl = `http://${host}:4200/image-files/default-gravatar.jpg`
// const defaultAvatarUrl = `http://${host}:${port}/image-files/default-gravatar.jpg`
// const defaultAvatarUrl = 'http://localhost:9002/image-files/default-gravatar.jpg'
console.log(`default avatar url: ${defaultAvatarUrl}`)

const commandLineArgs = require('command-line-args')
const optionDefinitions = [
  { name: 'secure', type: Boolean },
  { name: 'prod', type: Boolean }
]
export const options = commandLineArgs(optionDefinitions)

const dbHost = !!options.dbHost ? options.dbHost : 'localhost'
const dbPort = !!options.dbPort ? options.dbPort : 6379
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
