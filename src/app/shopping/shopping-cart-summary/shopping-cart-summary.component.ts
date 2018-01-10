import { Component, OnInit, Input } from '@angular/core'
import { Cart } from '../../shared/services/shopping-cart.service'

@Component({
  selector: 'app-shopping-cart-summary',
  templateUrl: './shopping-cart-summary.component.html',
  styleUrls: ['./shopping-cart-summary.component.scss']
})
export class ShoppingCartSummaryComponent implements OnInit {

  @Input() cart: Cart
  constructor() { }

  ngOnInit() {
  }

}
