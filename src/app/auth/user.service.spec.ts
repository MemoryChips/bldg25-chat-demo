import { TestBed, inject } from '@angular/core/testing'

import { UserService } from './user.service'

import { HttpClient } from '@angular/common/http'
// import { of } from 'rxjs'

class MockHttpClient {
  put() {}
}

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpClient, useClass: MockHttpClient }
      ]
    })
  })

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy()
  }))
})
