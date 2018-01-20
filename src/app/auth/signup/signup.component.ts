import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { Credentials, AuthService } from '../auth.service'
// import { UserService } from '../../services/user.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  confirmPassword = 'Password10'
  credentials: Credentials
  passwordMatch = false   // TODO: this needs to be fixed
  hide = true

  email = new FormControl('', [Validators.required, Validators.email])

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        ''
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    // private _toastService: ToasterService
  ) {
    this.credentials = {
      email: 'three@default.com',
      password: 'Password10',
      userName: 'Default Three'
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  submitSignUp(data: any) {
    console.log(data.form.value)
    if (!this.credentials.userName) {this.credentials.userName = this.credentials.email}
    this.authService.signUp(this.credentials)
      .subscribe((user) => {
        if (user) {
          console.log(`I managed to signup: ${user}. Yes!`)
          this.routeToRedirect()
        } else {
          console.log('No user recieved and no error in response.')
        }
      }, (error) => {
        console.log(`Error while signing up: ${error}`)
      })
  }

  private routeToRedirect() {
    this.router.navigate([this.authService.returnUrl])
  }

}
