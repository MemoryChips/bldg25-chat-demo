import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs/Subscription'
import { AuthService } from '../auth.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  error: any

  private subscriptions: Array<Subscription> = []

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.subscriptions = [
      this.authService.user$.subscribe((user) => {
        if (user) {
          this.router.navigateByUrl('/home')
        }
      }),
    ]
  }

  ngOnDestroy() {
    this.subscriptions.map((s: Subscription) => {
      s.unsubscribe()
    })
  }

  loginGoogle() {
    this.authService.loginGoogle()
  }}
