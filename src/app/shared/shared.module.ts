import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { ProductCardComponent } from './components/product-card/product-card.component'
import { ProductQuantityComponent } from './components/product-quantity/product-quantity.component'
import { OrderService } from './services/order.service'
import { ProductService } from './services/product.service'
import { ShoppingCartService } from './services/shopping-cart.service'
import { RbacAllowDirective } from './directives/rbac-allow.directive'

@NgModule({
  imports: [CommonModule],
  declarations: [ProductCardComponent, ProductQuantityComponent, RbacAllowDirective],
  exports: [ProductCardComponent, ProductQuantityComponent, RbacAllowDirective],
  providers: [ProductService, OrderService, ShoppingCartService]
})
export class SharedModule {}
