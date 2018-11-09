import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms'
import { Router } from '@angular/router'

import { AuthService, SignUpInfo } from '../auth.service'

import { SignupValidators } from './signup.validators'
import { MatSnackBar } from '@angular/material'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  confirmPasswordText = 'Password10'
  hide = true

  form = new FormGroup(
    {
      email: new FormControl('robert.tamlyn@gmail.com', [Validators.required, Validators.email]),
      password: new FormControl('Password10', [
        Validators.required,
        Validators.minLength(3),
        SignupValidators.cannotContainSpace
      ]),
      confirmPassword: new FormControl('Password10', [Validators.required]),
      userName: new FormControl(
        'Robert',
        [Validators.required, Validators.minLength(3), SignupValidators.cannotContainSpace],
        [SignupValidators.shouldBeUniqueUserName]
      ),
      avatarUrl: new FormControl(
        'http://localhost:4200/assets/cat.jpg'
        // [Validators.required, Validators.minLength(3), SignupValidators.cannotContainSpace],
        // [SignupValidators.shouldBeUniqueUserName]
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

  constructor(
    private authService: AuthService,
    private router: Router,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  submitSignUp() {
    console.log(this.form.value)
    const credentials: SignUpInfo = this.form.value
    credentials.avatarUrl = credentials.avatarUrl || ''
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
      err => {
        console.log(`Error while signing up: ${err}`)
        this.snackBar.open(err.error.errors[0], 'dismiss', { duration: 2000 })
      }
    )
  }

  formControlError(input: AbstractControl | null, error: string): boolean {
    if (!input) return false
    else return !!input.errors && input.touched && input.errors[error]
  }

  formControlInvalid(input: AbstractControl | null): boolean {
    if (!input) return false
    else return !!input.errors && input.touched && input.invalid
  }

  private routeToRedirect() {
    this.router.navigate([this.authService.returnUrl])
  }
}
