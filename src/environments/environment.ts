// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const host = 'localhost'
const port = 4200

// const host = process.env.HOST_URL || 'localhost'
// const port = process.env.PORT || 4200

export const environment = {
  production: false,
  webSocketServerUrl: `ws://${host}:${port}/api-ws`
}
