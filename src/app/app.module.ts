import { AuthModule } from './auth/auth.module'
import { CoreModule } from './core/core.module'
import { ShoppingModule } from './shopping/shopping.module'
import { AdminModule } from './admin/admin.module'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { AngularFireModule } from 'angularfire2'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { CustomFormsModule } from 'ng2-validation'

import { environment } from '../environments/environment'
import { AppComponent } from './app.component'
// import { AuthGuard } from './auth/auth.guard'
// import { AuthService } from './auth/auth.service'
import { LoginComponent } from './auth/login/login.component'
// import { SignupComponent } from './auth/signup/signup.component'
// import { UserService } from './auth/user.service'
import { CoursesListComponent } from './courses-list/courses-list.component'
import { HomeComponent } from './core/home/home.component'
import { MaterialModule } from './material/material.module'
import { SharedModule } from './shared/shared.module'

// import { DataTableModule } from 'angular-4-data-table'

@NgModule({
  declarations: [
    AppComponent,
    CoursesListComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    ShoppingModule,
    AdminModule,
    CoreModule,
    AuthModule,
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
      { path: 'login', component: LoginComponent },
    ])
  ],
  providers: [
    // AuthService,
    // AuthGuard,
    // UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
