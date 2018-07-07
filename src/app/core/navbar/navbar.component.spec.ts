import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { NavbarComponent } from './navbar.component'
import { MaterialModule } from '../../material/material.module'
import { AuthService } from '../../auth/auth.service'
import { ShoppingCartService } from '../../shared/services/shopping-cart.service'
import { of } from 'rxjs'

class MockAuthService {
  user$ = of({})
  isLoggedIn$ = of(false)
}
class MockShoppingCartService {
  cart$ = of({})
}
describe('NavbarComponent', () => {
  let component: NavbarComponent
  let fixture: ComponentFixture<NavbarComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [NavbarComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ShoppingCartService, useClass: MockShoppingCartService }
      ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
