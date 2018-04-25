import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { HttpClient } from '@angular/common/http'

// Must be added to application
import { ChatLoginService } from 'bldg25-chat'
// import { ChatLoginService } from '../chat/chat.module' // for debug should remove this

export interface Credentials {
  userName?: string
  email: string
  password: string
}

// application user must have the properties for ChatUser
export interface AppUser {
  email: string
  id: string
  roles: string[]
  userName: string
  loginTime: number
  active: boolean // Some activity in the last 15 mins?
  unreadMessages?: number
  isAdmin?: boolean
  avatarUrl?: string
}

export const ANONYMOUS_USER: AppUser = {
  email: 'guest',
  id: '', // keep this falsey
  roles: [],
  userName: 'anonymous',
  loginTime: 0,
  active: false,
  isAdmin: false
}

@Injectable()
export class AuthService {
  userSubject$ = new BehaviorSubject<AppUser>(undefined)
  // TODO: is asObservabel reeallt needed
  // user$: Observable<AppUser> = this.userSubject$.filter(user => !!user)
  user$: Observable<AppUser> = this.userSubject$
    .asObservable()
    .filter(user => !!user)

  returnUrl = '/'
  isLoggedIn$: Observable<boolean> = this.user$.map(user => !!user.id)
  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.map(
    isLoggedIn => !isLoggedIn
  )
  chatConnection: WebSocket

  public showPassword = false
  public passwordInputType = 'password'

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private chatLoginService: ChatLoginService
  ) {
    console.log('Auth service created.')
    this.returnUrl = localStorage.getItem('returnUrl') || '/'
    this.http.get<AppUser>('/api/auth/user-me').subscribe(user => {
      this.userSubject$.next(user.id ? user : ANONYMOUS_USER)
    })
  }

  logout(): Observable<any> {
    return this.http
      .post('/api/auth/logout', null)
      .shareReplay()
      .do(_user => {
        // this must be added to alert chat that the user is logged in
        this.chatLoginService.setLoggedInState(false)
        this.userSubject$.next(ANONYMOUS_USER)
        this.router.navigateByUrl('/home')
      })
  }

  getReturnUrl() {
    return this.returnUrl
  }
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
    return this.http
      .post<AppUser>('/api/auth/signup', credentials)
      .shareReplay()
      .do(user => this.userSubject$.next(user))
  }

  login(credentials: Credentials) {
    this.preLogin()
    return this.http
      .post<AppUser>('/api/auth/login', credentials)
      .shareReplay()
      .do(user => {
        this.userSubject$.next(user)
        // this must be added to alert chat that the user is logged in
        this.chatLoginService.setLoggedInState(true)
      })
  }

  socialLogin(provider: string) {
    this.preLogin()
    return this.http
      .get<AppUser>('/api/auth/social-login/' + provider)
      .shareReplay()
      .do(user => this.userSubject$.next(user))
  }
}
