import { TestBed, inject } from '@angular/core/testing'

import { ShoppingCartService, Cart } from './shopping-cart.service'

import { HttpClient } from '@angular/common/http'
import { of } from 'rxjs'

const exampleCart: Cart = new Cart()
class MockHttpClient {
  get() {
    return of(exampleCart)
  }
  post() {}
}

describe('ShoppingCartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ShoppingCartService,
        { provide: HttpClient, useClass: MockHttpClient }
      ]
    })
  })

  it('should be created', inject(
    [ShoppingCartService],
    (service: ShoppingCartService) => {
      expect(service).toBeTruthy()
    }
  ))
})
