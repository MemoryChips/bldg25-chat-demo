import { Component, OnInit } from '@angular/core'
import { ShoppingCartService, Cart } from '../../shared/services/shopping-cart.service'
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  cart$: Observable<Cart>

  constructor(
    private shoppingCartService: ShoppingCartService
  ) { }

  async ngOnInit() {
    this.cart$ = await this.shoppingCartService.getCart()
  }

  clearCart() {
    this.shoppingCartService.clearCart()
  }
}
