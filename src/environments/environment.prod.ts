const host = 'localhost'
const port = 9000

// const host = process.env.HOST_URL || 'localhost'
// const port = process.env.PORT || 4200

export const environment = {
  production: false,
  webSocketServerUrl: `ws://${host}:${port}/api-ws`
}
