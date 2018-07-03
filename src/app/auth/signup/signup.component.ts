import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { Credentials, AuthService } from '../auth.service'

import { SignupValidators } from './signup.validators'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  confirmPasswordText = 'Password10'
  // credentials: Credentials
  passwordMatch = false // TODO: this needs to be fixed
  hide = true

  form = new FormGroup(
    {
      email: new FormControl('robert.tamlyn@gmail.com', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('Password10', [
        Validators.required,
        SignupValidators.cannotContainSpace
      ]),
      confirmPassword: new FormControl('Password10', [Validators.required]),
      userName: new FormControl(
        'Robert',
        [
          Validators.required,
          Validators.minLength(3),
          SignupValidators.cannotContainSpace
        ],
        [SignupValidators.shouldBeUniqueUserName]
      )
    },
    SignupValidators.matchPassword
  )
  get userName() {
    return this.form.get('userName')
  }
  get email() {
    return this.form.get('email')
  }
  get password() {
    return this.form.get('password')
  }
  get confirmPassword() {
    return this.form.get('confirmPassword')
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  ngOnDestroy() {}

  submitSignUp() {
    console.log(this.form.value)
    const credentials: Credentials = this.form.value
    if (!credentials.userName) {
      credentials.userName = credentials.email
    }
    this.authService.signUp(credentials).subscribe(
      user => {
        if (user) {
          console.log(`I managed to signup: ${user}. Yes!`)
          this.routeToRedirect()
        } else {
          console.log('No user recieved and no error in response.')
        }
      },
      error => {
        console.log(`Error while signing up: ${error}`)
      }
    )
  }

  private routeToRedirect() {
    this.router.navigate([this.authService.returnUrl])
  }
}
