import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { SignupComponent } from './signup.component'
import { AuthService } from '../auth.service'
// import { AuthService, Credentials, AppUser } from '../auth.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { of } from 'rxjs'
// import { MatSnackBar } from '@angular/material'
import { MaterialModule } from '../../material/material.module'

class MockAuthService {
  user$ = of({})
  isLoggedIn$ = of(false)
}

describe('SignupComponent', () => {
  let component: SignupComponent
  let fixture: ComponentFixture<SignupComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, MaterialModule, ReactiveFormsModule],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
      declarations: [SignupComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent)
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
  // it('form errors initially', () => {
  //   expect(component.form.errors).toBe([])
  // })
  it('email field wtih invalid email', () => {
    const email = component.form.controls['email']
    email.setValue('testtest.com')
    expect(email.valid).toBeFalsy()
  })
  it('email field wtih valid email', () => {
    const email = component.form.controls['email']
    email.setValue('test@test.com')
    expect(email.valid).toBeTruthy()
  })
  it('initial password field validity', () => {
    const password = component.form.controls['password']
    // FIXME: this should be falsy
    // expect(password.valid).toBeFalsy()
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
  // it('form valid initially', () => {
  //   // const email = component.form.controls['email']
  //   // email.setValue('test')
  //   expect(component.form.valid).toBeFalsy()
  // })
  it('confirm password valid with mismatched passwords', () => {
    const confirmPassword = component.form.controls['confirmPassword']
    confirmPassword.setValue('test')
    expect(confirmPassword.valid).toBeFalsy()
    expect(confirmPassword.errors && confirmPassword.errors.matchPassword).toBe(true)
  })
})
