import { Component, OnInit } from '@angular/core'
import { AuthService } from './auth/auth.service'
// import { UserService } from './auth/user.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Chat5'

  constructor(
    private auth: AuthService,
    // private userService: UserService,
    private router: Router
  ) {
    this.auth.user$.subscribe(_user => {
      // if (!user) return
      // this.userService.saveUser(user)  // ensures we have the update name in the database
      const returnUrl = localStorage.getItem('returnUrl')
      if (!returnUrl) return
      localStorage.removeItem('returnUrl')
      // this.router.navigate([returnUrl])
      // this.router.navigateByUrl(returnUrl)
      setTimeout(() => {
        this.router.navigateByUrl(returnUrl)
      }, 0)
    })
  }

  ngOnInit() {
  }

}
