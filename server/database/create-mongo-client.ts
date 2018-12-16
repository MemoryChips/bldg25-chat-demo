import { MongoClient } from 'mongodb'
// import { serverConfig } from '../server-config'

export function createMongoClient(mongoUrl: string): Promise<MongoClient> {
  return MongoClient.connect(
    mongoUrl,
    { useNewUrlParser: true }
  ).then(client => {
    console.log(`Mongo client created using ${mongoUrl}`)
    return client
  })
  // .catch(_err => {
  //   console.error(`${_err}`)
  //   console.log(`Unable to create Mongo client using ${serverConfig.mongoUrl}`)
  //   return null
  // })
}
