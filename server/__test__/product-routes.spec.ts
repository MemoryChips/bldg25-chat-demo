import { serverConfig } from './test-config'
// import { testConfig } from './test-config'
import fetch from 'node-fetch'

import { Product } from '../product/product-api'
const verbose = false
const serverType = 'http'

const serverUrl = `${serverType}://${serverConfig.serverHost}:${serverConfig.serverPort}`
const productRequestUrl = `${serverUrl}/api/product`

let fetchedProducts: Product[] = []

describe('Api product endpoints', () => {
  it(`should fetch product list`, (done: DoneFn) => {
    fetch(`${productRequestUrl}/all`)
      .then(res => res.json())
      .then(products => {
        fetchedProducts = products
        // productKeys = products.map((p: DbProduct) => (p._id ? p._id.toHexString() : ''))
        if (verbose) {
          console.log(products)
        }
        expect(products.length).toBe(21)
        done()
      })
  })
  it(`should fetch the last product in the list`, (done: DoneFn) => {
    const productToFetch = fetchedProducts[fetchedProducts.length - 1]
    const id = productToFetch.key
    // console.log(`${id} ${productToFetch.title} ${Object.keys(productToFetch)}`)
    if (id) {
      fetch(`${productRequestUrl}/${id}`)
        .then(res => res.json())
        .then((product: Product) => {
          if (verbose) {
            console.log(product)
          }
          expect(product.title).toBe(productToFetch.title)
          done()
        })
    } else {
      expect(id).toBeTruthy()
      done()
    }
  })
})
