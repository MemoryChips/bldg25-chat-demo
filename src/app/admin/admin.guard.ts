import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router'
import { AuthService, AppUser } from '../auth/auth.service'
import 'rxjs/add/operator/switchMap'
import { Observable } from 'rxjs/Observable'

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private auth: AuthService) { }

  canActivate(): Observable<boolean> {
    return this.auth.user$.map((appUser: AppUser) => appUser.roles.includes('ADMIN') || false)
  }

}
