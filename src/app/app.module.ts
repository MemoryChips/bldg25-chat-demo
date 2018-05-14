import { AuthModule } from './auth/auth.module'
import { CoreModule } from './core/core.module'
import { ShoppingModule } from './shopping/shopping.module'
import { AdminModule } from './admin/admin.module'
import { NgModule } from '@angular/core'
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { CustomFormsModule } from 'ng2-validation'

// import { environment } from '../environments/environment'
import { AppComponent } from './app.component'
// import { AuthGuard } from './auth/auth.guard'
// import { AuthService } from './auth/auth.service'
import { LoginComponent } from './auth/login/login.component'
import { SignupComponent } from './auth/signup/signup.component'
// import { UserService } from './auth/user.service'
import { HomeComponent } from './core/home/home.component'
import { MaterialModule } from './material/material.module'
import { SharedModule } from './shared/shared.module'

import { ChatModule } from 'bldg25-chat'

@NgModule({
  declarations: [AppComponent],
  imports: [
    // DataTableModule,
    BrowserModule,
    SharedModule,
    ShoppingModule,
    AdminModule,
    CoreModule,
    AuthModule,
    ChatModule.forRoot({
      name: 'Sherlock Holmes',
      webSocketServerUrl: 'ws://localhost:4200/api-ws',
      chatOpenAtLogin: false,
      reconnectInterval: 5000,
      reconnectAttempts: 6
    }),
    // NgbModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'x-xsrf-token'
    }),
    FormsModule,
    CustomFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent }
    ])
  ],
  providers: [
    // AuthService,
    // AuthGuard,
    // UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
