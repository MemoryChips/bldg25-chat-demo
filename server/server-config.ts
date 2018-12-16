// Command line settings
import { ClientOpts } from 'redis'
import commandLineArgs from 'command-line-args'
const optionDefinitions = [
  { name: 'secure', type: Boolean },
  { name: 'prod', type: Boolean },
  { name: 'useRedisCategories', type: Boolean },
  { name: 'useChatMemDb', type: Boolean }
]
export const options = commandLineArgs(optionDefinitions)
function getOption(option: string, defOption: any) {
  return options[option] ? options[option] : defOption
}

// defaults to demo on Atlas
const mongoDataBase = process.env.MONGO_DATABASE || 'demo'
const mongoUrl = process.env.MONGO_URL || 'atlas-mongo-url-here'

// heroku host format
// https://stormy-mountain-18015.herokuapp.com

// Environment Settings from/for Heroku
const host = process.env.HOST_URL || 'localhost'
const port = process.env.PORT || 9000

const serverHttp = options.secure ? 'https' : 'http'

const imagePort = process.env.PORT || 4200 // 4200 for dev mode; prod sets PORT to 9000
const imageUrl = `${serverHttp}://${host}:${imagePort}`

// defaults to localhost and false
const useRedisCategories: boolean = getOption('useRedisCategories', false)
const redisDbHost = process.env.REDIS_DB_HOST || 'localhost'
const redisDbPort = Number(process.env.REDIS_DB_PORT || 6379)
const redisDbNum = process.env.REDIS_DB_NUM || 2
const redisDbAuthCode = process.env.REDIS_DB_AUTHCODE || 'this_should_be_a_secret_authcode'

const redisClientOptions: ClientOpts = {
  host: redisDbHost,
  port: redisDbPort,
  auth_pass: redisDbAuthCode,
  db: redisDbNum,
  retry_strategy: retryOptions => {
    console.log(
      `Trying to reconnect: ${retryOptions.attempt} attempt. ${
        retryOptions.total_retry_time
      } total retry time.`
    )
    return 5000
  }
}
export const serverConfig = {
  verbose: true,
  host,
  port,
  imageUrl,
  // defaultAvatarUrl,
  secure: !!options.secure,
  prod: !!options.prod,
  useChatMemDb: !!options.useChatMemDb,
  // mongo db options
  mongoUrl,
  mongoDataBase,
  // redis db options
  useRedisCategories,
  // redisDbHost,
  // redisDbPort,
  // redisDbAuthCode,
  // redisDbNum,
  redisClientOptions
}

export const TOKEN_AGE_MS = 24 * 60 * 60 * 1000
