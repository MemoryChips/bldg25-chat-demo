// tslint:disable:max-line-length
import { serverConfig } from './test-config'
import { testConfig } from './test-config'
import fetch from 'node-fetch'
const verbose = false
const serverType = 'http'

const serverUrl = `${serverType}://${serverConfig.chatServerHost}:${serverConfig.chatServerPort}`
const loginRequestUrl = `${serverUrl}/api/auth/login`
const signupRequestUrl = `${serverUrl}/api/auth/signup`
const deleteRequestUrl = `${serverUrl}/api/auth/user/${testConfig.signupCredentials.email}`
let adminCookie: string
let nonAdminCookie = 'get a non admin cookie in here'

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
    }).then((res: any) => {
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
    }).then((res: any) => {
      const prop = Object.getOwnPropertySymbols(res.headers)
      const cookies = res.headers[prop[0]]['set-cookie']
      adminCookie = `${cookies[0]} ${cookies[1]}`
      if (verbose) {
        console.log(res.body)
        console.log(res.headers)
      }
      expect(res.status).toBe(200)
      done()
    })
  })
  it(`should accept ${
    testConfig.signupCredentials.email
  } signup with signup credentials`, (done: DoneFn) => {
    fetch(signupRequestUrl, {
      method: 'POST',
      body: JSON.stringify(testConfig.signupCredentials),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res: any) => {
      const prop = Object.getOwnPropertySymbols(res.headers)
      const cookies = res.headers[prop[0]]['set-cookie']
      nonAdminCookie = `${cookies[0]} ${cookies[1]}`
      if (verbose) {
        console.log(res.body)
        console.log(res.headers)
      }
      expect(res.status).toBe(200)
      done()
    })
  })
  it(`should fail to delete user ${
    testConfig.signupCredentials.email
  } using bad authorization`, (done: DoneFn) => {
    fetch(deleteRequestUrl, {
      method: 'DELETE',
      body: '',
      headers: {
        cookie: nonAdminCookie,
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
  it(`should delete user ${
    testConfig.signupCredentials.email
  } using good authorization`, (done: DoneFn) => {
    fetch(deleteRequestUrl, {
      method: 'DELETE',
      body: '',
      headers: {
        cookie: adminCookie,
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
