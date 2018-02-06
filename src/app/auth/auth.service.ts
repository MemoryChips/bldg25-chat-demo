import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { HttpClient } from '@angular/common/http'

export interface AppUser {
  email: string,
  id: undefined,
  roles: string[],
  userName: string,
  isAdmin?: boolean,
}
export const ANONYMOUS_USER: AppUser = {
  id: undefined,
  email: undefined,
  userName: 'anonymous',
  roles: []
}

export interface Credentials {
  userName?: string
  email: string
  password: string
}

@Injectable()
export class AuthService {

  userSubject$ = new BehaviorSubject<AppUser>(undefined)
  user$: Observable<AppUser> = this.userSubject$.asObservable().filter(user => !!user)

  returnUrl = '/'
  isLoggedIn$: Observable<boolean> = this.user$.map(user => !!user.id)
  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.map(isLoggedIn => !isLoggedIn)
  chatConnection: WebSocket

  public showPassword = false
  public passwordInputType = 'password'

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    console.log('Auth service created.')
    this.returnUrl = localStorage.getItem('returnUrl') || '/'
    this.http.get<AppUser>('/api/auth/user-me')
      .subscribe((user) => {
        this.userSubject$.next(user.id ? user : ANONYMOUS_USER)
      }
    )
    // this.isLoggedIn$.subscribe((isLoggedIn) => {
    //   if (isLoggedIn) {
    //     this.connectChat()
    //   } else {
    //     if (this.chatConnection) { this.chatConnection.close() }
    //   }
    // })
  }

  // private connectChat() {
  //   this.chatConnection = new WebSocket('ws://localhost:4200/api-ws')
  //   this.chatConnection.onmessage = (m) => { console.log('Server: ' + m.data) }
  //   window.setTimeout(() => {
  //     this.chatConnection.send('timer message')
  //   }, 1000)
  // }

  logout(): Observable<any> {
    return this.http.post('/api/auth/logout', null)
      .shareReplay()
      .do(_user => {
        this.userSubject$.next(ANONYMOUS_USER)
        this.router.navigateByUrl('/home')
      })
  }

  getReturnUrl() {return this.returnUrl}
  setReturnUrl(url: string) {
    localStorage.setItem('returnUrl', this.returnUrl)
    this.returnUrl = url
  }

  preLogin() {
    // safe to use snapshot since we do not have next and prev on the login page
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/'
    localStorage.setItem('returnUrl', returnUrl)
  }

  signUp(credentials: Credentials) {
    return this.http.post<AppUser>('/api/auth/signup', credentials)
      .shareReplay()
      .do(user => this.userSubject$.next(user))
  }

  login(credentials: Credentials) {
    this.preLogin()
    return this.http.post<AppUser>('/api/auth/login', credentials)
      .shareReplay()
      .do(user => {
        this.userSubject$.next(user)
      })
  }

  socialLogin(provider: string) {
    this.preLogin()
    return this.http.get<AppUser>('/api/auth/social-login/' + provider)
      .shareReplay()
      .do(user => this.userSubject$.next(user))
  }

}
