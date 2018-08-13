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
  it(`should accept ${
    testConfig.signupCredentials.email
  } signup with signup credentials`, (done: DoneFn) => {
    fetch(signupRequestUrl, {
      method: 'POST',
      body: JSON.stringify(testConfig.signupCredentials),
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
  it(`should fail to delete user ${
    testConfig.signupCredentials.email
  } using bad authorization`, (done: DoneFn) => {
    fetch(deleteRequestUrl, {
      method: 'DELETE',
      body: '',
      headers: {
        cookie:
          'SESSIONID=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJTVFVERU5UIl0sImlhdCI6MTUzNDEwNTMyNCwiZXhwIjoxNTM0MTkxNzI0LCJzdWIiOiJ7XCJpZFwiOlwiZmk4bHAzd2ZxMGNqa3JhcDg0dFwiLFwiZW1haWxcIjpcIm5ld0BnbWFpbC5jb21cIixcInJvbGVzXCI6W1wiU1RVREVOVFwiXSxcImF2YXRhclVybFwiOlwiXCJ9In0.Uyx1Ni3_ujiVvNLa0o27eH7d4T7Kctci6zQJMNJ0J9qhPpIA1eL-XDQ9cfjavoCu-50pECNYYZ4O-Zd0v8wrgWhRBUr5nQwc6CQh1W2ynk4RkkOtZav2NlH2dqSsq8GRxOum7T4lBr_T_Vu79pzN26i4Wo8AnCA2yoMus_ugPWs; Path=/; HttpOnlyXSRF-TOKEN=a8cb707d6c2112291b636596d69c8f481d662cfd644101ef0f3ca5124434a232; Path=/',
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
        cookie:
          'SESSIONID=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJTVFVERU5UIiwiQURNSU4iXSwiaWF0IjoxNTM0MTAyNDgzLCJleHAiOjE1MzQxODg4ODMsInN1YiI6IntcImlkXCI6XCJ1cDNwODhqdnB1b2pqazNidjF0XCIsXCJlbWFpbFwiOlwiYWRtaW5AZ21haWwuY29tXCIsXCJ1c2VyTmFtZVwiOlwiTXJBZG1pblwiLFwicm9sZXNcIjpbXCJTVFVERU5UXCIsXCJBRE1JTlwiXSxcImF2YXRhclVybFwiOlwiaHR0cDovL2xvY2FsaG9zdDo5MDAzL2ltYWdlLWZpbGVzL2NhdC5qcGdcIn0ifQ.J0Cuj_kvj_QXbxetQu4Bf4gGi_6hnhDCwF9IorHoYGuYRznhFh7v0iLmZrIM69XeW8dNr46tv5XkqtXF1QBuoN8NsbmnHuH9qWLGiqqcp0zV6aQaFiJk1TMYJ9KiKU9-LnFyX-koxXyk4otElmRx7EBF0HWEI2pafrIXjny1Avc; Max-Age=86400; Path=/; Expires=Mon, 13 Aug 2018 19:34:43 GMT; HttpOnly; XSRF-TOKEN=c12f0d5af5cf6ede9d23c9212a1b57cd48f8fde35ce5dc65e7d6d54903a2c0d2; Path=/',
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
