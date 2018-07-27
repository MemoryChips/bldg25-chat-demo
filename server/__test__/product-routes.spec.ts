// tslint:disable:max-line-length
import { serverConfig } from './test-config'
// import { testConfig } from './test-config'
import fetch from 'node-fetch'
const verbose = false
const serverType = 'http'

const serverUrl = `${serverType}://${serverConfig.chatServerHost}:${
  serverConfig.chatServerPort
}`
const productRequestUrl = `${serverUrl}/api/product`

describe('Api product endpoints', () => {
  it(`should fetch product list`, (done: DoneFn) => {
    fetch(`${productRequestUrl}/all`)
      .then(res => res.json())
      .then(products => {
        if (verbose) {
          console.log(products)
        }
        const numProducts = Object.keys(products).length
        expect(numProducts).toBe(21)
        done()
      })
  })
})
