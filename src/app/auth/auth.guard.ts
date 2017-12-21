import { Injectable } from '@angular/core'
import { CanActivate, RouterStateSnapshot } from '@angular/router'
import { Router } from '@angular/router'
import { AuthService } from './auth.service'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(_route, state: RouterStateSnapshot): Observable<boolean> {
    // console.log('What is this parameter in canActivate function?', route)
    return this.authService.user$.map(user => {
      if (user) { return true }
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
      return false
    })
  }

}
