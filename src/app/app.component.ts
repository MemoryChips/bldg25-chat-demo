import { Component, OnInit } from '@angular/core'
import { AuthService } from './auth/auth.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Chat 6 Demo'

  constructor(private auth: AuthService, private router: Router) {
    this.auth.user$.subscribe(_user => {
      const returnUrl = localStorage.getItem('returnUrl')
      if (!returnUrl) return
      localStorage.removeItem('returnUrl')
      setTimeout(() => {
        this.router.navigateByUrl(returnUrl)
      }, 0)
    })
  }

  ngOnInit() {}
}
