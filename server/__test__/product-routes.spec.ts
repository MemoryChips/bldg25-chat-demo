import { serverConfig } from './test-config'
// import { testConfig } from './test-config'
import fetch from 'node-fetch'

import { DbProducts, DbProduct } from '../product/product-api'
const verbose = false
const serverType = 'http'

const serverUrl = `${serverType}://${serverConfig.chatServerHost}:${
  serverConfig.chatServerPort
}`
const productRequestUrl = `${serverUrl}/api/product`

let fetchedProducts: DbProducts = {}
let productKeys: string[] = []

describe('Api product endpoints', () => {
  it(`should fetch product list`, (done: DoneFn) => {
    fetch(`${productRequestUrl}/all`)
      .then(res => res.json())
      .then(products => {
        fetchedProducts = products
        productKeys = Object.keys(fetchedProducts)
        if (verbose) {
          console.log(products)
        }
        const numProducts = productKeys.length
        expect(numProducts).toBe(21)
        done()
      })
  })
  it(`should fetch the last product in the list`, (done: DoneFn) => {
    const productId = productKeys[productKeys.length - 1]
    fetch(`${productRequestUrl}/${productId}`)
      .then(res => res.json())
      .then((product: DbProduct) => {
        if (verbose) {
          console.log(product)
        }
        expect(product.title).toBe(fetchedProducts[productId].title)
        done()
      })
  })
})
