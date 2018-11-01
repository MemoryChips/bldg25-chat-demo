import { MongoClient } from 'mongodb'
import { serverConfig } from '../server-config'

export function createMongoClient(): Promise<MongoClient> {
  return MongoClient.connect(
    serverConfig.mongoUrl,
    { useNewUrlParser: true }
  ).then(client => {
    // TODO: Do these events happen?
    client.on('error', err => {
      // Can I reconnect here?
      console.error(`Error in client: ${err} Can I reconnect?`)
    })
    client.on('connect', _e => {
      console.log(`Connect event`)
    })
    client.on('reconnect', _e => {
      console.log(`Reconnect event`)
    })

    return client
  })
}
