import { TestBed, inject } from '@angular/core/testing'

import { AuthGuard } from './auth.guard'
import { RouterTestingModule } from '@angular/router/testing'
import { AuthService } from './auth.service'
import { of } from 'rxjs'

class MockAuthService {
  user$ = of({})
  isLoggedIn$ = of(false)
}

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        AuthGuard
      ]
    })
  })

  it('should be created', inject([AuthGuard], (service: AuthGuard) => {
    expect(service).toBeTruthy()
  }))
})
