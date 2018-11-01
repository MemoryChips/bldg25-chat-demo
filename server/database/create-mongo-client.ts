import { MongoClient } from 'mongodb'
import { serverConfig } from '../server-config'

export function createMongoClient(): Promise<MongoClient> {
  return MongoClient.connect(
    serverConfig.mongoUrl,
    { useNewUrlParser: true }
  )
}
