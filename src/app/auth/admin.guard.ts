import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router'
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { AuthService } from './auth.service'
// import { UserService } from './user.service'
import 'rxjs/add/operator/switchMap'
import { Observable } from 'rxjs/Observable'
import { AppUser } from './../models/app-user'

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private auth: AuthService) { }

  canActivate(): Observable<boolean> {
    return this.auth.appUser$.map((appUser: AppUser) => appUser.isAdmin || false)
  }

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //   return true
  // }

}
