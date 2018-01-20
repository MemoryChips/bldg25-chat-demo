import { Component, OnInit } from '@angular/core'
import { AuthService, AppUser } from '../../auth/auth.service'
import { ShoppingCartService, Cart } from '../../shared/services/shopping-cart.service'
import { Subscription } from 'rxjs/Subscription'
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  appUser: AppUser
  isAdmin = false
  isLoggedIn = false
  cart: Cart

  private subscriptions: Subscription[]

  constructor(
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService
  ) { }

  ngOnInit() {
    this.subscriptions = [
      this.shoppingCartService.cart$.subscribe(cart => this.cart = cart),
      this.authService.user$.subscribe(appUser => {
        this.appUser = appUser
        this.isAdmin = appUser.roles.includes('admin')
      }),
      this.authService.isLoggedIn$.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn)
    ]
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  logout() {
    this.authService.logout().subscribe((success) => {
      if (success) {
        console.log('logged out')
      }
    })
  }
}
