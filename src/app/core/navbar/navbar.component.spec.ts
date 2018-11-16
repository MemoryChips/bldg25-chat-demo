import { async, ComponentFixture, TestBed } from '@angular/core/testing'
// import { RouterLink } from '@angular/router'
// import { RouterLinkWithHref } from '@angular/router'
// import { RouterTestingModule } from '@angular/router/testing'
import { By } from '@angular/platform-browser'

import { NavbarComponent } from './navbar.component'
import { SharedModule } from '../../shared/shared.module'
import { MaterialModule } from '../../material/material.module'
import { AuthService } from '../../auth/auth.service'
import { ShoppingCartService } from '../../shared/services/shopping-cart.service'
import { of } from 'rxjs'

class MockAuthService {
  user$ = of({}) // Perhaps this should be a real user or null
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
      imports: [SharedModule, MaterialModule],
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

  it('should have a links to login signup and products pages', () => {
    const de = fixture.debugElement.queryAll(By.css('.fa-sign-in'))
    expect(de.length).toBe(1)
    const links = fixture.debugElement.queryAll(By.css('[routerLink]'))
    let index = links.findIndex(link => link.attributes.routerLink === '/login')
    expect(index).not.toBe(-1)
    index = links.findIndex(link => link.attributes.routerLink === '/products')
    expect(index).not.toBe(-1)
    index = links.findIndex(link => link.attributes.routerLink === '/signup')
    expect(index).not.toBe(-1)
  })
})
