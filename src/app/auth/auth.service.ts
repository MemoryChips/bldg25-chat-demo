import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { AngularFireAuth } from 'angularfire2/auth'
import { auth, User } from 'firebase'

@Injectable()
export class AuthService {

  user$: Observable<User>

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut().then(() => {
      console.log('successful logout')
    }).catch((err) => {
      console.log('Error logging out.', err)
    })
  }

  loginGoogle(): Promise<any> {
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
