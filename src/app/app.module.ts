import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { MaterialModule } from './material/material.module'
import { FormsModule } from '@angular/forms'
import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

import { RouterModule } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

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
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'shopping-cart', component: ShoppingCartComponent },
      { path: 'check-out', component: CheckOutComponent },
      { path: 'order-success', component: OrderSuccessComponent },
      { path: 'my/orders', component: MyOrdersComponent },
      { path: 'login', component: LoginComponent },
      { path: 'admin/products', component: AdminProductsComponent },
      { path: 'admin/orders', component: AdminOrdersComponent },
    ])
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
