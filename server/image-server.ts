import express from 'express'
import http from 'http'

const imageServerPort = process.env.IMAGE_SERVER_PORT || 9001

const app: express.Application = express()

app.use('/image-files', express.static(__dirname + '/images'))
console.log('/image-files path:' + __dirname + '/images')

const imageServer = http.createServer(app)

imageServer.listen(imageServerPort, () => {
  console.log(`Image server runnning on ${imageServerPort}`)
})
