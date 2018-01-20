import { SignupComponent } from './signup/signup.component'
import { LoginComponent } from './login/login.component'
import { AuthService } from './auth.service'
import { AuthGuard } from './auth.guard'
import { UserService } from './user.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { MaterialModule } from '../material/material.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule
  ],
  declarations: [
    LoginComponent,
    SignupComponent,
  ],
  providers: [
    AuthService,
    AuthGuard,
    UserService,
  ],

})
export class AuthModule { }
