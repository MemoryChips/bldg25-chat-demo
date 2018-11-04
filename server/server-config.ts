// import * as fs from 'fs'

// Command line settings
import commandLineArgs from 'command-line-args'
const optionDefinitions = [
  { name: 'secure', type: Boolean },
  { name: 'prod', type: Boolean },
  { name: 'useRedisCategories', type: Boolean },
  { name: 'redisDbHost', type: String },
  { name: 'redisDbPort', type: Number },
  { name: 'redisDbAuthCode', type: String },
  { name: 'redisDbNum', type: Number },
  { name: 'mongoDbLocation', type: String },
  { name: 'mongoDbUser', type: String },
  { name: 'mongoDbPassword', type: String },
  { name: 'mongoDataBase', type: String }
]
export const options = commandLineArgs(optionDefinitions)
function getOption(option: string, defOption: any) {
  return options[option] ? options[option] : defOption
}

// defaults to redistogo
const redisDbHost = getOption('redisDbHost', 'catfish.redistogo.com')
const redisDbPort = getOption('redisDbHost', 9782)
const redisDbAuthCode = getOption('redisDbAuthCode', '63cf95b9b1a52f2fe6d0a9c5a67fa527')
// const fsAuthCode = fs.readFileSync('./server/keys/redis-togo-dbauath.key').toString()
// console.log(fsAuthCode)
// const redisDbAuthCode = getOption('redisDbHost', fsAuthCode)
// use 0 when using a cloud redis server
const redisDbNum = getOption('redisDbHost', 0)
const useRedisCategories = getOption('useRedisCategories', true)

// // defaults to localhost
// const redisDbHost = getOption('redisDbHost', 'localhost')
// const redisDbPort = getOption('redisDbHost', 6379)
// const redisDbAuthCode = getOption('redisDbHost', 'this_should_be_a_secret_authcode')
// // use 0 when using a cloud redis server
// const redisDbNum = getOption('redisDbHost', 2)
// const useRedisCategories = getOption('useRedisCategories', true)

// defaults to demo on Atlas
const mongoDbUser = !!options.mongoDbUser ? options.mongoDbUser : 'chat-dev-server'
const mongoDbPassword = !!options.mongoDbPassword ? options.mongoDbPassword : '21d2oe66yv'
const mongoDbLocation = !!options.mongoDbLocation
  ? options.mongoDbLocation
  : '@dev-vejwg.mongodb.net'
const mongoDataBase = !!options.mongoDataBase ? options.mongoDataBase : 'demo'
// end default chat-demo-local

// // defaults to chat-demo-local on Mlab
// const mongoDbUser = !!options.mongoDbUser ? options.mongoDbUser : 'chat-demo-local-user'
// const mongoDbPassword = !!options.mongoDbPassword ? options.mongoDbPassword : 'ustbqv605f'
// const mongoDbLocation = !!options.mongoDbLocation
//   ? options.mongoDbLocation
//   : '@ds131763.mlab.com:31763'
// const mongoDataBase = !!options.mongoDataBase ? options.mongoDataBase : 'chat-demo-local'
// // end default chat-demo-local

// heroku mlab settings (for local test)
// const mongoDbPassword = !!options.mongoDbPassword ? options.mongoDbPassword : 'xi3bye949h'
// const mongoDbLocation = !!options.mongoDbLocation
//   ? options.mongoDbLocation
//   : '@ds223653.mlab.com:23653'
// const mongoDataBase = !!options.mongoDataBase ? options.mongoDataBase : 'chat-demo'
// end heroku mlab settings

// Mlab version
// const mongoUrl = `mongodb://${mongoDbUser}:${mongoDbPassword}${mongoDbLocation}/${mongoDataBase}`
// Atlas version
const mongoUrl = `mongodb+srv://${mongoDbUser}:${mongoDbPassword}${mongoDbLocation}/${mongoDataBase}?retryWrites=true`
// END command line args

// heroku host format
// https://stormy-mountain-18015.herokuapp.com

// Environment Settings
const host = process.env.HOST_URL || 'localhost'
const port = process.env.PORT || 9000

const serverHttp = options.secure ? 'https' : 'http'
const serverUrl = `${serverHttp}://${host}:${port}`

const imagePort = process.env.PROD || options.prod ? port : 4200
const imageUrl = `${serverHttp}://${host}:${imagePort}`
const defaultAvatarUrl = process.env.DEFAULT_AVATAR_URL || `${imageUrl}/assets/default-gravatar.jpg`
console.log(`default avatar url: ${defaultAvatarUrl}`)

export const serverConfig = {
  verbose: true,
  host,
  port,
  serverUrl,
  imageUrl,
  defaultAvatarUrl,
  secure: !!options.secure,
  prod: !!options.prod,
  // mongo db options
  mongoUrl,
  mongoDataBase,
  // redis db options
  useRedisCategories,
  redisDbHost,
  redisDbPort,
  redisDbAuthCode,
  redisDbNum
}

export const TOKEN_AGE_MS = 24 * 60 * 60 * 1000
