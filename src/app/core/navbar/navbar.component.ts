import { Component, OnInit } from '@angular/core'
import { AuthService, AppUser } from '../../auth/auth.service'
import { ShoppingCartService, Cart } from '../../shared/services/shopping-cart.service'
import { Subscription } from 'rxjs/Subscription'
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks'
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  appUser: AppUser
  cart$: Observable<Cart>

  private subscriptions: Subscription[]

  constructor(
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService
  ) { }

  async ngOnInit() {
    this.cart$ = await this.shoppingCartService.getCart()
    this.subscriptions = [
      this.authService.appUser$.subscribe(appUser => this.appUser = appUser)
    ]
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  logout() {this.authService.logout()}
}
