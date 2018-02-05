import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { Subscription } from 'rxjs/Subscription'
import { AuthService, Credentials, AppUser } from '../auth.service'
import { Router } from '@angular/router'
import { Unsubscribe } from 'shared/utils'
import { MatSnackBar } from '@angular/material'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  user: AppUser
  isLoggedIn = false
  _subscriptions: Array<Subscription> = []
  credentials: Credentials = {
    email: 'admin@gmail.com',
    password: 'Password10'
  }
  showPassword = false
  passwordInputType = 'password'
  hide = true
  email = new FormControl('', [Validators.required, Validators.email])

  constructor(
    private authService: AuthService,
    private router: Router,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this._subscriptions = [
      this.authService.user$.subscribe(user => this.user = user),
      this.authService.isLoggedIn$.subscribe(isLoggedIn => { this.isLoggedIn = isLoggedIn })
    ]
  }

  @Unsubscribe()
  ngOnDestroy() {
    // this._subscriptions.map((s: Subscription) => {
    //   s.unsubscribe()
    // })
  }

  // ---- template handlers --------------------------------------------------------------------------------------------

  toggleShowPassword() {
    this.showPassword = !this.showPassword
    if (this.showPassword) {
      this.passwordInputType = 'text'
    } else {
      this.passwordInputType = 'password'
    }
  }

  submitSocialLogin(provider: string) {
    this.authService.socialLogin(provider).subscribe((_user) => {
      if (_user) {
        console.log('Success! Redirecting now...', _user)
        this.routeToRedirect()
      }
    }, err => {
      console.log('Error logging in.', err)
    })
  }

  submitLogin() {
    this.authService.login(this.credentials).subscribe((_user) => {
      console.log('Success! Redirecting now...', _user)
      this.routeToRedirect()
    }, err => {
      console.log('Error logging in.', err)
      this.openSnackBar(err.error, 'dismiss')
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    })
  }

  private routeToRedirect() {
    this.router.navigate([this.authService.returnUrl])
  }

}