import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { ProductCardComponent } from './components/product-card/product-card.component'
import { ProductQuantityComponent } from './components/product-quantity/product-quantity.component'
import { CategoryService } from './services/category.service'
import { OrderService } from './services/order.service'
import { ProductService } from './services/product.service'
import { ShoppingCartService } from './services/shopping-cart.service'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ProductCardComponent,
    ProductQuantityComponent,
  ],
  exports: [
    ProductCardComponent,
    ProductQuantityComponent,
  ],
  providers: [
    CategoryService,
    ProductService,
    OrderService,
    ShoppingCartService
  ]
})
export class SharedModule { }
