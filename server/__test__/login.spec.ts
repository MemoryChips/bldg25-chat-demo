// tslint:disable:max-line-length
// import * as frisby from 'frisby'
// @types/frisby causes tsc errors when compiling the application
const frisby = require('frisby')
// const Joi = frisby.Joi
import { serverConfig } from './test-config'
import { testConfig } from './test-config'

const verbose = false
const serverType = 'http'
// const serverType = 'https'  // jest does not work with https

const serverUrl = `${serverType}://${serverConfig.chatServerHost}:${
  serverConfig.chatServerPort
}`
const loginRequestUrl = `${serverUrl}/api/auth/login`

describe('Api Auth endpoints', () => {
  it(`should block ${
    testConfig.badCredentials.email
  } from login with bad credentials`, (done: DoneFn) => {
    frisby
      .post(loginRequestUrl, testConfig.badCredentials)
      .expect('status', 403)
      // .expectNot('json', badUser.expected)
      .done(done)
  })
  it(`should accept ${
    testConfig.goodCredentials.email
  } from login with good credentials`, (done: DoneFn) => {
    frisby
      .post(loginRequestUrl, testConfig.goodCredentials)
      .expect('status', 200)
      // .expectNot('json', badUser.expected)
      .then((res: any) => {
        if (verbose) {
          console.log(res.body)
          console.log(res.headers)
        }
      })
      .done(done)
  })
})

/*
cookies =
{
  SESSIONID: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJTVFVERU5UIiwiQURNSU4iXSwiaWF0IjoxNTI5MzU3OTkwLCJleHAiOjE2MDEzNTc5OTAsInN1YiI6IntcImlkXCI6XCJrcWlwY2FqdDRzOGppa21tY2xzXCIsXCJlbWFpbFwiOlwiYWRtaW5AZ21haWwuY29tXCIsXCJ1c2VyTmFtZVwiOlwiTXJBZG1pblwiLFwicm9sZXNcIjpbXCJTVFVERU5UXCIsXCJBRE1JTlwiXSxcImF2YXRhclVybFwiOlwiaHR0cDovL2xvY2FsaG9zdDo5MDAzL2ltYWdlLWZpbGVzL2RvZy5qcGdcIn0ifQ.fKm18umrqZOlaKb2YjP35iTiGkqoXC8zrkoCvc8ZcwaJWh1sKp-HkJNfoy6zJDCzaa2sCwwGTYCeWtBn4QbSrxLAcYkWSPrA7vTBJe0c3CfIY3Am6MS0EwVBfyFgUocYQZ5-r2QrT455TGdeEet4lY8xXLMO6uDpQz5IUhu7NC0; Max-Age=86400; Path=/; Expires=Tue, 19 Jun 2018 21:39:50 GMT; HttpOnly',
  'XSRF-TOKEN': '97e550bf2cfa179b187514da8b3b82aa26ecc3a15f93dee3efa1a5788986c2cd; Path=/'
}
*/
