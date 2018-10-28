import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs'
import { filter, map, shareReplay, tap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'

// Must be added to application
import { ChatLoginService } from 'bldg25-chat'

// Align FE/BE
export interface Credentials {
  email: string
  password: string
  userName?: string
}

export interface SignUpInfo {
  email: string
  password: string
  userName: string
  avatarUrl: string
}

export interface UserWoId {
  email: string
  userName: string
  roles: string[]
  avatarUrl: string
}

export interface User extends UserWoId {
  _id: string
}
// end Align FE/BE

export const ANONYMOUS_USER: User = {
  email: 'guest',
  _id: '', // keep this falsey
  roles: [],
  userName: 'Guest',
  avatarUrl: ''
}

@Injectable()
export class AuthService {
  userSubject$ = new BehaviorSubject<User>(ANONYMOUS_USER)
  // TODO: is asObservabel reeallt needed
  // user$: Observable<AppUser> = this.userSubject$.filter(user => !!user)
  user$: Observable<User> = this.userSubject$.asObservable().pipe(filter((user: User) => !!user))

  returnUrl = '/'
  isLoggedIn$: Observable<boolean> = this.user$.pipe(map(user => !!user._id))
  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.pipe(map(isLoggedIn => !isLoggedIn))
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
    this.http.get<User>('/api/auth/user-me').subscribe(
      user => {
        if (!!user._id) {
          this._completeLogin(user)
        } else {
          this.userSubject$.next(user._id ? user : ANONYMOUS_USER)
        }
      },
      err => {
        console.log(`User failed to logout: ${err.message}`)
      }
    )
  }

  logout(): Observable<any> {
    return this.http.post('/api/auth/logout', null).pipe(
      shareReplay(),
      tap(_user => {
        // this must be added to alert chat that the user is logged out
        this.chatLoginService.setLoggedInState(false)
        this.userSubject$.next(ANONYMOUS_USER)
        this.router.navigateByUrl('/home')
      })
    )
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
    return this.http.post<User>('/api/auth/signup', credentials).pipe(
      shareReplay(),
      tap(user => {
        this.userSubject$.next(user)
        // this must be added to alert chat that the user is logged in
        this.chatLoginService.setLoggedInState(true)
      })
    )
  }

  login(credentials: Credentials) {
    this.preLogin()
    return this.http.post<User>('/api/auth/login', credentials).pipe(
      shareReplay(),
      tap(user => {
        this._completeLogin(user)
      })
    )
  }

  private _completeLogin(user: User) {
    this.userSubject$.next(user)
    // this must be added to alert chat that the user is logged in
    this.chatLoginService.setLoggedInState(true)
  }

  socialLogin(provider: string) {
    this.preLogin()
    return this.http.get<User>('/api/auth/social-login/' + provider).pipe(
      shareReplay(),
      tap(user => this.userSubject$.next(user))
    )
  }
}
