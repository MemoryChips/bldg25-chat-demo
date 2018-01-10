import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { User } from 'firebase'
import { Observable } from 'rxjs/Observable'
import { AppUser } from 'app/auth/auth.service'

@Injectable()
export class UserService {

  constructor(private db: AngularFireDatabase) { }

  save(user: User) {
    this.db.object('/users/' + user.uid).update({
      name: user.displayName,
      email: user.email
    }).catch((err) => {
      console.log('Error updating user: ', err)
    })
  }

  get(uid: string): Observable<AppUser> {
    return this.db.object('/users/' + uid).valueChanges() as Observable<AppUser>
  }

}
