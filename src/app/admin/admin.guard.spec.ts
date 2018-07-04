import { TestBed, inject } from '@angular/core/testing'

import { AdminGuard } from './admin.guard'
import { AuthService } from '../auth/auth.service'

class MockAuthService {}

describe('AdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useClass: MockAuthService }
      ]
    })
  })

  it('should ...', inject([AdminGuard], (guard: AdminGuard) => {
    expect(guard).toBeTruthy()
  }))
})
