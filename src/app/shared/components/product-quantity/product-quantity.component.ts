import { Component, OnInit, Input } from '@angular/core'
import { Cart, ShoppingCartService } from '../../services/shopping-cart.service'
import { Product } from 'shared/services/product.service'

@Component({
  selector: 'app-product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.scss']
})
export class ProductQuantityComponent implements OnInit {

  @Input() product: Product
  @Input() cart: Cart

  constructor(private cartService: ShoppingCartService) { }

  ngOnInit() {
  }

  updateCart(q: number = 1) {
    this.cartService.updateItemQuantity(this.product, q)
  }

}
