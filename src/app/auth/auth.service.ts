import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { ActivatedRoute } from '@angular/router'
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

  private subject = new BehaviorSubject<AppUser>(undefined)
  returnUrl = '/'
  user$: Observable<AppUser> = this.subject.asObservable().filter(user => !!user)
  isLoggedIn$: Observable<boolean> = this.user$.map(user => !!user.id)
  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.map(isLoggedIn => !isLoggedIn)
  chatConnection: WebSocket

  public showPassword = false
  public passwordInputType = 'password'

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    // private userService: UserService
  ) {
    this.returnUrl = localStorage.getItem('returnUrl') || '/'
    this.http.get<AppUser>('/api/user')
      // .do(console.log)
      .subscribe((user) => {
        this.subject.next(user ? user : ANONYMOUS_USER)
      }
    )
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.connectChat()
      } else {
        if (this.chatConnection) { this.chatConnection.close() }
      }
    })
  }

  private connectChat() {
    this.chatConnection = new WebSocket('ws://localhost:4200/api-ws')
    this.chatConnection.onmessage = (m) => { console.log('Server: ' + m.data) }
    window.setTimeout(() => {
      this.chatConnection.send('timer message')
    }, 1000)
  }

  logout(): Observable<any> {
    return this.http.post('/api/logout', null)
      .shareReplay()
      .do(_user => this.subject.next(ANONYMOUS_USER))
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
    return this.http.post<AppUser>('/api/signup', credentials)
      .shareReplay()
      .do(user => this.subject.next(user))
  }

  login(credentials: Credentials) {
    this.preLogin()
    return this.http.post<AppUser>('/api/login', credentials)
      .shareReplay()
      .do(user => {
        this.subject.next(user)
      })
  }

  socialLogin(provider: string) {
    this.preLogin()
    return this.http.get<AppUser>('/api/social-login/' + provider)
      .shareReplay()
      .do(user => this.subject.next(user))
  }

}
