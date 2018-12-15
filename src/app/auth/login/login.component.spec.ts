import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { LoginComponent } from './login.component'
import { AuthService } from '../auth.service'
// import { AuthService, Credentials, AppUser } from '../auth.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { of } from 'rxjs'
import { MatSnackBar } from '@angular/material'
import { MaterialModule } from '../../material/material.module'

class MockAuthService {
  user$ = of({})
  isLoggedIn$ = of(false)
}

class MockSnackBar {}

describe('LoginComponent', () => {
  let component: LoginComponent
  let fixture: ComponentFixture<LoginComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, MaterialModule, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatSnackBar, useClass: MockSnackBar }
      ],
      declarations: [LoginComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent)
    component = fixture.componentInstance
    component.ngOnInit()
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
  // it('form invalid initially', () => {
  //   expect(component.form.valid).toBeFalsy()
  // })
  it('email field validity', () => {
    const email = component.form.controls['email']
    email.setValue('test')
    expect(email.valid).toBeFalsy()
  })
  it('initial password field validity', () => {
    const password = component.form.controls['password']
    expect(password.valid).toBeTruthy()
  })
  it('good password and bad password with blank', () => {
    const password = component.form.controls['password']
    password.setValue('abcccde')
    expect(password.valid).toBeTruthy()
    password.setValue('a a')
    expect(password.valid).toBeFalsy()
  })
  it('form invalid with bad email', () => {
    const email = component.form.controls['email']
    email.setValue('test')
    expect(component.form.valid).toBeFalsy()
  })
})
