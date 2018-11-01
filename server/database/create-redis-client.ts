import { RedisClient, createClient } from 'redis'
import { serverConfig } from '../server-config'

export function createRedisClient(): Promise<RedisClient> {
  return new Promise<RedisClient>((resolve, reject) => {
    const redisClient: RedisClient = createClient({
      host: serverConfig.redisDbHost,
      auth_pass: serverConfig.redisDbAuthCode,
      port: serverConfig.redisDbPort,
      db: serverConfig.redisDbNum,
      retry_strategy: retryOptions => {
        console.log(
          `Trying to reconnect: ${retryOptions.attempt} attempt. ${
            retryOptions.total_retry_time
          } total retry time.`
        )
        return 5000
      }
    })
    redisClient.on('reconnecting', _e => {
      console.log(`Attempting reconnect`)
    })
    redisClient.on('connect', () => {
      console.log(`Redis client is connected`)
    })
    redisClient.on('ready', () => {
      console.log(`Connected to redis client: ${serverConfig.redisDbHost}`)
      resolve(redisClient)
    })
    redisClient.on('error', err => {
      console.error(`Redis client error: ${err}`)
      reject(err)
    })
  })
}
