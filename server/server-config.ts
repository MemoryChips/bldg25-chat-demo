// Command line settings
const commandLineArgs = require('command-line-args')
const optionDefinitions = [
  { name: 'secure', type: Boolean },
  { name: 'prod', type: Boolean },
  { name: 'useRedisLocal', type: Boolean },
  { name: 'mongoDbLocation', type: String },
  { name: 'mongoDbUser', type: String },
  { name: 'mongoDbPassword', type: String },
  { name: 'mongoDataBase', type: Number }
]
// FIXME: align options with heroku procfile
// TODO: create temp override to new heroku demo database
export const options = commandLineArgs(optionDefinitions)
const mongoDbUser = !!options.mongoDbUser ? options.mongoDbUser : 'chat-demo-local-user'
const mongoDbPassword = !!options.mongoDbPassword ? options.mongoDbPassword : 'ustbqv605f'
const mongoDbLocation = !!options.mongoDbLocation
  ? options.mongoDbLocation
  : '@ds131763.mlab.com:31763'
const mongoDataBase = !!options.mongoDataBase ? options.mongoDataBase : 'chat-demo-local'
// const mongoDbPassword = !!options.mongoDbPassword ? options.mongoDbPassword : 'xi3bye949h'
// const mongoDbLocation = !!options.mongoDbLocation
//   ? options.mongoDbLocation
//   : '@ds223653.mlab.com:23653'
// const mongoDataBase = !!options.mongoDataBase ? options.mongoDataBase : 'chat-demo'
const mongoUrl = `mongodb://${mongoDbUser}:${mongoDbPassword}${mongoDbLocation}/${mongoDataBase}`
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

export const serverConfig = {
  verbose: true,
  log: console.log,
  host,
  port,
  chatServerPort,
  serverUrl,
  mongoUrl,
  mongoDataBase,
  useRedisLocal: !!options.useRedisLocal,
  imageUrl,
  defaultAvatarUrl,
  secure: !!options.secure,
  prod: !!options.prod
}

export const TOKEN_AGE_MS = 24 * 60 * 60 * 1000
