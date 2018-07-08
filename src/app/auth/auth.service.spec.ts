import { TestBed, inject } from '@angular/core/testing'

import { AuthService, AppUser } from './auth.service'
import { ActivatedRoute } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { ChatLoginService } from 'bldg25-chat'
import { HttpClient } from '@angular/common/http'
import { of } from 'rxjs'

const PRETEND_USER: AppUser = {
  email: 'pretend@gmail.com',
  id: 'xyz', // keep this falsey
  roles: ['STUDENT'],
  userName: 'Pretend',
  loginTime: 42,
  active: false,
  isAdmin: false
}

let loggedIn = false
class MockChatLoginService {
  setLoggedInState(b: boolean) {
    loggedIn = b
  }
}
class MockHttpClient {
  get() {
    return of(PRETEND_USER)
  }
}
class MockActivatedRoute {
  snapshot = {
    routeConfig: {
      path: 'not_a_real_path'
    },
    paramMap: {
      get: () => 'fake_id'
    }
  }
}

// let authService: AuthService

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthService,
        { provide: HttpClient, useClass: MockHttpClient },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: ChatLoginService, useClass: MockChatLoginService }
      ]
    })
    // authService = TestBed.get(AuthService)
  })

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy()
    expect(loggedIn).toBe(true)
  }))
})
