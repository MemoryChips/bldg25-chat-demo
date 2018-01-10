import { Component, OnInit } from '@angular/core'
import { Input } from '@angular/core'
import { ShoppingCartService, Cart } from '../../services/shopping-cart.service'
import { Product } from 'shared/services/product.service'

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input('show-actions') showActions = true
  @Input() product: Product
  @Input() cart: Cart

  constructor(private cartService: ShoppingCartService) { }

  ngOnInit() {
  }

  updateCart(q: number = 1) {
    this.cartService.updateItemQuantity(this.product, q)
  }

  // getQuantity() {
  //   if (!this.cart) return 0
  //   const item = this.cart.items[this.product.key]
  //   return item ? item.quantity : 0
  // }

}
