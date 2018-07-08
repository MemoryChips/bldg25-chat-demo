import { TestBed, inject } from '@angular/core/testing'

import { ProductService } from './product.service'
import { HttpClient } from '@angular/common/http'

import { of } from 'rxjs'

class MockHttpClient {
  get() {
    return of([])
  }
}
describe('ProductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: HttpClient, useClass: MockHttpClient }
      ]
    })
  })

  it('should be created', inject(
    [ProductService],
    (service: ProductService) => {
      expect(service).toBeTruthy()
    }
  ))
})
