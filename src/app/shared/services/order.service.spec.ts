import { TestBed, inject } from '@angular/core/testing'

import { OrderService } from './order.service'
import { HttpClient } from '@angular/common/http'
import { of } from 'rxjs'
import { ShoppingCartService } from 'shared/services/shopping-cart.service'

class MockHttpClient {
  get() {
    return of([])
  }
}
class MockShoppingCartService {}

describe('OrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderService,
        { provide: HttpClient, useClass: MockHttpClient },
        { provide: ShoppingCartService, useClass: MockShoppingCartService }
      ]
    })
  })

  it('should be created', inject([OrderService], (service: OrderService) => {
    expect(service).toBeTruthy()
  }))
})
