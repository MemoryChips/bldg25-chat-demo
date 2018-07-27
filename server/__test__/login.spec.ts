// tslint:disable:max-line-length
import { serverConfig } from './test-config'
import { testConfig } from './test-config'
import fetch from 'node-fetch'
const verbose = false
const serverType = 'http'

const serverUrl = `${serverType}://${serverConfig.chatServerHost}:${
  serverConfig.chatServerPort
}`
const loginRequestUrl = `${serverUrl}/api/auth/login`

describe('Api Auth endpoints with node-fetch', () => {
  it(`should block ${
    testConfig.goodCredentials.email
  } login with bad credentials`, (done: DoneFn) => {
    fetch(loginRequestUrl, {
      method: 'POST',
      body: JSON.stringify(testConfig.badCredentials),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (verbose) {
        console.log(res.body)
        console.log(res.headers)
      }
      expect(res.status).toBe(403)
      done()
    })
  })
  it(`should accept ${
    testConfig.goodCredentials.email
  } login with good credentials`, (done: DoneFn) => {
    fetch(loginRequestUrl, {
      method: 'POST',
      body: JSON.stringify(testConfig.goodCredentials),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (verbose) {
        console.log(res.body)
        console.log(res.headers)
      }
      expect(res.status).toBe(200)
      done()
    })
  })
})

/*
cookies =
{
  SESSIONID: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJTVFVERU5UIiwiQURNSU4iXSwiaWF0IjoxNTI5MzU3OTkwLCJleHAiOjE2MDEzNTc5OTAsInN1YiI6IntcImlkXCI6XCJrcWlwY2FqdDRzOGppa21tY2xzXCIsXCJlbWFpbFwiOlwiYWRtaW5AZ21haWwuY29tXCIsXCJ1c2VyTmFtZVwiOlwiTXJBZG1pblwiLFwicm9sZXNcIjpbXCJTVFVERU5UXCIsXCJBRE1JTlwiXSxcImF2YXRhclVybFwiOlwiaHR0cDovL2xvY2FsaG9zdDo5MDAzL2ltYWdlLWZpbGVzL2RvZy5qcGdcIn0ifQ.fKm18umrqZOlaKb2YjP35iTiGkqoXC8zrkoCvc8ZcwaJWh1sKp-HkJNfoy6zJDCzaa2sCwwGTYCeWtBn4QbSrxLAcYkWSPrA7vTBJe0c3CfIY3Am6MS0EwVBfyFgUocYQZ5-r2QrT455TGdeEet4lY8xXLMO6uDpQz5IUhu7NC0; Max-Age=86400; Path=/; Expires=Tue, 19 Jun 2018 21:39:50 GMT; HttpOnly',
  'XSRF-TOKEN': '97e550bf2cfa179b187514da8b3b82aa26ecc3a15f93dee3efa1a5788986c2cd; Path=/'
}
*/
