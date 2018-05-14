import { Component, OnInit } from '@angular/core'
import {
  ShoppingCartService,
  Cart
} from '../../shared/services/shopping-cart.service'
import { Subscription } from 'rxjs'
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks'

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  cart: Cart

  private subscriptions: Subscription[]

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit() {
    this.subscriptions = [
      this.shoppingCartService.cart$.subscribe(cart => (this.cart = cart))
    ]
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  clearCart() {
    this.shoppingCartService.clearCart()
  }
}
