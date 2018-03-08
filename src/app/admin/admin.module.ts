import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { AuthGuard } from 'app/auth/auth.guard'
import { SharedModule } from 'shared/shared.module'

import { MaterialModule } from '../material/material.module'
import { AdminOrdersComponent } from './admin-orders/admin-orders.component'
import { AdminProductsComponent } from './admin-products/admin-products.component'
import { AdminGuard } from './admin.guard'
import { ProductFormComponent } from './product-form/product-form.component'
import { BroadcastMessageComponent } from '../chat/components/broadcast-message/broadcast-message.component'
import { DataTableModule } from 'ng5-data-table'

@NgModule({
  imports: [
    DataTableModule,
    CommonModule,
    FormsModule,
    SharedModule,
    MaterialModule,
    RouterModule.forChild([
      { path: 'admin/products/copy/:id', component: ProductFormComponent, canActivate: [AuthGuard, AdminGuard] },
      { path: 'admin/products/new', component: ProductFormComponent, canActivate: [AuthGuard, AdminGuard] },
      { path: 'admin/products/:id', component: ProductFormComponent, canActivate: [AuthGuard, AdminGuard] },
      { path: 'admin/products', component: AdminProductsComponent, canActivate: [AuthGuard, AdminGuard] },
      { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AuthGuard, AdminGuard] },
      { path: 'admin/broadcastMessage', component: BroadcastMessageComponent, canActivate: [AuthGuard, AdminGuard] },
    ])
  ],
  declarations: [
    AdminProductsComponent,
    AdminOrdersComponent,
    ProductFormComponent,
    // BroadcastMessageComponent,
  ],
  providers: [
    AdminGuard,
  ]
})
export class AdminModule { }
