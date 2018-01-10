import { RouterModule } from '@angular/router'
import { AuthGuard } from '../auth/auth.guard'
import { CheckOutComponent } from './check-out/check-out.component'
import { MyOrdersComponent } from './my-orders/my-orders.component'
import { OrderSuccessComponent } from './order-success/order-success.component'
import { ProductsComponent } from './products/products.component'
import { ProductFilterComponent } from './products/product-filter/product-filter.component'
import { ShippingFormComponent } from './shipping-form/shipping-form.component'
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component'
import { ShoppingCartSummaryComponent } from './shopping-cart-summary/shopping-cart-summary.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from 'shared/shared.module'
import { FormsModule } from '@angular/forms'

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'products', component: ProductsComponent },
      { path: 'shopping-cart', component: ShoppingCartComponent },
      { path: 'check-out', component: CheckOutComponent, canActivate: [AuthGuard] },
      { path: 'order-success/:id', component: OrderSuccessComponent, canActivate: [AuthGuard] },
      { path: 'my/orders', component: MyOrdersComponent, canActivate: [AuthGuard] },
    ])
  ],
  declarations: [
    CheckOutComponent,
    MyOrdersComponent,
    OrderSuccessComponent,
    ProductsComponent,
    ProductFilterComponent,
    ShippingFormComponent,
    ShoppingCartComponent,
    ShoppingCartSummaryComponent,
  ]
})
export class ShoppingModule { }
