import { Component, OnInit } from '@angular/core'
import { AuthService } from '../auth/auth.service'
import { AppUser } from '../models/app-user'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  appUser: AppUser
  constructor(private authService: AuthService) {
    authService.appUser$.subscribe(appUser => this.appUser = appUser)
   }

  ngOnInit() {
  }

  logout() {this.authService.logout()}
}
