// import { RedisDatabase } from './redis'
import { redisdb as redisDbTest } from './redis'
import { resetAppDb } from './reset-app-db'

// const redisDbTest = new RedisDatabase(0)

redisDbTest
  .flushDb()
  .then(() => resetAppDb(redisDbTest))
  .then(r => r && redisDbTest.quit())
  .then(qs => {
    console.log(`Quit success: ${qs}`)
  })
  .catch(err => console.log(`Error resetting db: ${err}`))
