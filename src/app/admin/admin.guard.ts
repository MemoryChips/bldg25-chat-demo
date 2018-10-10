import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router'
import { AuthService, User } from '../auth/auth.service'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  canActivate(): Observable<boolean> {
    return this.auth.user$.pipe(
      map((appUser: User) => appUser.roles.includes('ADMIN') || false)
    )
  }
}
