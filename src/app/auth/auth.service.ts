import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { AngularFireAuth } from 'angularfire2/auth'
import { auth, User } from 'firebase'
import { ActivatedRoute } from '@angular/router'
import { Router } from '@angular/router'
import { AppUser } from './../models/app-user'
import { UserService } from './user.service'

@Injectable()
export class AuthService {

  user$: Observable<User>

  constructor(
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.user$ = this.afAuth.authState
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut().then(() => {
      console.log('successful logout')
      this.router.navigateByUrl('/home')
    }).catch((err) => {
      console.log('Error logging out.', err)
    })
  }

  get appUser$(): Observable<AppUser> {
    return this.user$
      .switchMap(user => {
        if (user) { return this.userService.get(user.uid) }
        return Observable.of(null)
      })
  }

  preLogin() {
    // safe to use snapshot since we do not have next and prev on the login page
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/'
    localStorage.setItem('returnUrl', returnUrl)
  }

  loginGoogle(): Promise<any> {
    this.preLogin()
    return this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider()).then(() => {
      console.log('successful login with Google')
    }).catch((err) => {
      console.log('Error during login with Google.', err)
    })
  }

  // loginFb() {
  //   this.angularFireAuth.auth.signInWithPopup({
  //     provider: AUTH_PROVIDERS..Facebook,
  //     method: AuthMethods.Popup,
  //   }).then(
  //     (success) => {
  //       this.router.navigate(['/members']);
  //     }).catch(
  //     (err) => {
  //       this.error = err;
  //     })
  // }

}
