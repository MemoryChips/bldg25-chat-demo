// Command line settings
import commandLineArgs from 'command-line-args'
const optionDefinitions = [
  { name: 'secure', type: Boolean },
  { name: 'prod', type: Boolean },
  { name: 'useRedisCategories', type: Boolean }
]
export const options = commandLineArgs(optionDefinitions)
function getOption(option: string, defOption: any) {
  return options[option] ? options[option] : defOption
}

// defaults to redistogo
// const useRedisCategories = getOption('useRedisCategories', true)
// const redisDbHost = process.env.REDIS_DB_HOST || 'catfish.redistogo.com'
// const redisDbPort = Number(process.env.REDIS_DB_PORT || 9782)
// const redisDbNum = process.env.REDIS_DB_NUM || 0
// const redisDbAuthCode = process.env.REDIS_DB_AUTHCODE || '63cf95b9b1a52f2fe6d0a9c5a67fa527'
// // defaults to localhost and false
const useRedisCategories = getOption('useRedisCategories', false)
const redisDbHost = process.env.REDIS_DB_HOST || 'localhost'
const redisDbPort = Number(process.env.REDIS_DB_PORT || 6379)
const redisDbNum = process.env.REDIS_DB_NUM || 2
const redisDbAuthCode = process.env.REDIS_DB_AUTHCODE || 'this_should_be_a_secret_authcode'

// defaults to demo on Atlas
// const mongoDbUser = process.env.MONGO_DB_USER || 'chat-demo-server' // This user does not exist yet
const mongoDbUser = process.env.MONGO_DB_USER || 'chat-dev-server'
const mongoDbPassword = process.env.MONGO_DB_PASSWORD || '21d2oe66yv'
const mongoDbLocation = process.env.MONGO_DB_LOCATION || '@dev-vejwg.mongodb.net'
const mongoDataBase = process.env.MONGO_DATABASE || 'demo'
const mongoUrl = `mongodb+srv://${mongoDbUser}:${mongoDbPassword}${mongoDbLocation}/${mongoDataBase}?retryWrites=true`

// heroku host format
// https://stormy-mountain-18015.herokuapp.com

// Environment Settings from Heroku
const host = process.env.HOST_URL || 'localhost'

// TODO: serverUrl appears to no longer be used
const port = process.env.PORT || 9000
const serverHttp = options.secure ? 'https' : 'http'
const serverUrlXX = `${serverHttp}://${host}:${port}`
console.log(`server url: ${serverUrlXX}`)
// End no longer used

// PORT was set to 48759 on heroku for stormy mountain
const imagePort = process.env.PORT || 4200 // 4200 for dev mode; prod sets PORT to 9000
// const imagePort = process.env.PORT || options.port ? port : 4200
const imageUrl = `${serverHttp}://${host}:${imagePort}`
const defaultAvatarUrl = process.env.DEFAULT_AVATAR_URL || `${imageUrl}/assets/default-gravatar.jpg`
console.log(`default avatar url: ${defaultAvatarUrl}`)

export const serverConfig = {
  verbose: true,
  host,
  port,
  // serverUrl, // TODO: this guy appears to not be used anymore
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
