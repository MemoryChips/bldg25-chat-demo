import { RbacAllowDirective } from './rbac-allow.directive'

import { TemplateRef, Component } from '@angular/core'
import { AuthService } from 'app/auth/auth.service'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { of, Observable } from 'rxjs'
import { User } from '../../auth/auth.service'

const adminUser: User = {
  email: 'guest',
  _id: '', // keep this falsey
  roles: ['SUPER_USER'],
  userName: 'Guest',
  avatarUrl: ''
}
@Component({
  template: `
    <p>First</p>
    <p *appRbacAllow="['SUPER_USER']">Second</p>
    <p *appRbacAllow="['ADMIN', 'SUPER_USER']">Third</p>
    <p *appRbacAllow="['ADMIN']">Fourth</p>
    <p *appRbacAllow="['DUMB_ASS']">Fifth</p>
  `
})
class DirectiveHostComponent {}

class MockAuthService {
  user$: Observable<User> = of(adminUser) // Perhaps this should be a real user or null
  isLoggedIn$ = of(false)
}

describe('RbacAllowDirective', () => {
  let fixture: ComponentFixture<DirectiveHostComponent>
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [DirectiveHostComponent, RbacAllowDirective],
      providers: [TemplateRef, { provide: AuthService, useClass: MockAuthService }]
    }).compileComponents()
  }))

  it('should disallow p as needed', () => {
    fixture = TestBed.createComponent(DirectiveHostComponent)
    fixture.detectChanges()
    const des = fixture.debugElement.queryAll(By.css('p'))
    expect(des[0]).toBeTruthy()
    expect(des[1]).toBeTruthy()
    expect(des[2]).toBeTruthy()
    expect(des.length).toBe(3)
  })
})
