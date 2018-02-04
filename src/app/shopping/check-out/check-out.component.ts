import { Component, OnInit } from '@angular/core'
import { ShoppingCartService, Cart } from '../../shared/services/shopping-cart.service'
import { Subscription } from 'rxjs/Subscription'
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks'

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit, OnDestroy {

  cart: Cart
  private subscriptions: Subscription[]

  constructor(
    private shoppingCartService: ShoppingCartService,
  ) {}

  async ngOnInit() {
    this.subscriptions = [
      this.shoppingCartService.cart$.subscribe(cart => this.cart = cart),
    ]
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

}
