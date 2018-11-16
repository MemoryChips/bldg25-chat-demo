import { AuthModule } from './auth/auth.module'
import { CoreModule } from './core/core.module'
import { ShoppingModule } from './shopping/shopping.module'
import { AdminModule } from './admin/admin.module'
import { NgModule } from '@angular/core'
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CustomFormsModule } from 'ng2-validation'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { MaterialModule } from './material/material.module'
import { SharedModule } from './shared/shared.module'

import { ChatModule } from 'bldg25-chat'

import { environment } from '../environments/environment'

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
    ChatModule.forRoot(environment.chatConfig),
    // ChatModule.forRoot({
    //   name: 'Sherlock Holmes',
    //   webSocketServerUrl,
    //   chatOpenAtLogin: false,
    //   reconnectInterval: 5000,
    //   reconnectAttempts: 6
    // }),
    // NgbModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'x-xsrf-token'
    }),
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    AppRoutingModule
  ],
  providers: [
    // AuthService,
    // AuthGuard,
    // UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
