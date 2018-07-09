const host = 'localhost' // Set this to the host url of the deployment server
const port = 4200 // Set this to the port of the deployment server
const httpType = 'https'
const webSocketProtocol = 'wss' // Keep this as wss unless you are deploying an unecrypted server

const serverUrl = `${httpType}://${host}:${port}/api-ws`
const webSocketServerUrl = `${webSocketProtocol}://${host}:${port}/api-ws`
console.log(`Building for a server at ${serverUrl}`)

export const environment = {
  production: true,
  chatConfig: {
    webSocketServerUrl,
    chatOpenAtLogin: false,
    reconnectInterval: 5000,
    reconnectAttempts: 6
  }
}
