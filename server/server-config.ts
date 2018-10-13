// Command line settings
// FIXME: change command ling args to mongo version
const commandLineArgs = require('command-line-args')
const optionDefinitions = [
  { name: 'secure', type: Boolean },
  { name: 'prod', type: Boolean }
  // { name: 'dbHost', type: String },
  // { name: 'dbAuth', type: String },
  // { name: 'dbPort', type: Number }
]
export const options = commandLineArgs(optionDefinitions)
// const dbHost = !!options.dbHost ? options.dbHost : 'localhost'
// const dbPort = !!options.dbPort ? options.dbPort : 6379
// const redisDbAuthCode = !!options.dbAuth ? options.dbAuth : 'this_should_be_a_secret_authcode'
// console.log(`Using ${dbHost}:${dbPort} for redis database`)
// console.log(`Using authcode ${redisDbAuthCode} for redis database`)
// END command line args

// heroku host format
// https://stormy-mountain-18015.herokuapp.com

// Environment Settings
const host = process.env.HOST_URL || 'localhost'
const port = process.env.PORT || 9000
const chatServerPort = Number(port)

const serverHttp = options.secure ? 'https' : 'http'
const serverUrl = `${serverHttp}://${host}:${port}`

const imagePort = process.env.PROD || options.prod ? port : 4200
const imageUrl = `${serverHttp}://${host}:${imagePort}`
const defaultAvatarUrl = process.env.DEFAULT_AVATAR_URL || `${imageUrl}/assets/default-gravatar.jpg`
console.log(`default avatar url: ${defaultAvatarUrl}`)

const mongoDbUser = 'chat-demo-user'
const mongoDbPassword = 'xi3bye949h'
const mongoDbLocation = '@ds223653.mlab.com:23653'
export const mongoDataBase = 'chat-demo'
export const mongoUrl = `mongodb://${mongoDbUser}:${mongoDbPassword}${mongoDbLocation}/${mongoDataBase}`

export const serverConfig = {
  verbose: true,
  log: console.log,
  host,
  port,
  chatServerPort,
  serverUrl,
  useRedisLocal: true, // FIXME: Heroku will not be using local redis
  imageUrl,
  defaultAvatarUrl,
  secure: !!options.secure,
  prod: !!options.prod
}

export const TOKEN_AGE_MS = 24 * 60 * 60 * 1000
