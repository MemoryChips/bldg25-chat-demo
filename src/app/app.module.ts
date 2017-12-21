import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { MaterialModule } from './material/material.module'
import { FormsModule } from '@angular/forms'
import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { CustomFormsModule } from 'ng2-validation'
import { RouterModule } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
// import { DataTableModule } from 'angular-4-data-table'
import { AppComponent } from './app.component'

import { environment } from '../environments/environment'
import { NavbarComponent } from './navbar/navbar.component'
import { FooterComponent } from './footer/footer.component'
import { CoursesListComponent } from './courses-list/courses-list.component'
import { LoginComponent } from './auth/login/login.component'
import { SignupComponent } from './auth/signup/signup.component'
import { HomeComponent } from './home/home.component'
import { ProductsComponent } from './products/products.component'
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component'
import { CheckOutComponent } from './check-out/check-out.component'
import { OrderSuccessComponent } from './order-success/order-success.component'
import { MyOrdersComponent } from './my-orders/my-orders.component'
import { AdminProductsComponent } from './admin/admin-products/admin-products.component'
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component'

import { AuthService } from './auth/auth.service'
import { UserService } from './auth/user.service'
import { CategoryService } from './services/category.service'
import { ProductService } from './services/product.service'
import { AdminGuard } from './auth/admin.guard'
import { AuthGuard } from './auth/auth.guard'
import { ProductFormComponent } from './admin/product-form/product-form.component'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    CoursesListComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    ProductsComponent,
    ShoppingCartComponent,
    CheckOutComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    ProductFormComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    // DataTableModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    CustomFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'login', component: LoginComponent },
      { path: 'shopping-cart', component: ShoppingCartComponent },

      { path: 'check-out', component: CheckOutComponent, canActivate: [AuthGuard] },
      { path: 'order-success', component: OrderSuccessComponent, canActivate: [AuthGuard] },
      { path: 'my/orders', component: MyOrdersComponent, canActivate: [AuthGuard] },

      { path: 'admin/products/new', component: ProductFormComponent, canActivate: [AuthGuard, AdminGuard] },
      { path: 'admin/products/:id', component: ProductFormComponent, canActivate: [AuthGuard, AdminGuard] },
      { path: 'admin/products', component: AdminProductsComponent, canActivate: [AuthGuard, AdminGuard] },
      { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AuthGuard, AdminGuard] },
    ])
  ],
  providers: [
    AuthService,
    AuthGuard,
    UserService,
    AdminGuard,
    CategoryService,
    ProductService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
