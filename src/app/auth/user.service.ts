import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AppUser } from 'app/auth/auth.service'
import { HttpClient } from '@angular/common/http'

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  // DOes this expect the server to extract the user info from the session?
  // saveUser(user: AppUser) {
  //   this.http.put('/api/user/' + user._id, user).subscribe(_user => {
  //     console.log('Saved user: ', _user)
  //   })
  // }

  getUser(uid: string): Observable<AppUser> {
    return this.http.get<AppUser>('/api/user/' + uid)
  }
}
