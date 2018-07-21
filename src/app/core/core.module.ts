import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'

import { FooterComponent } from './footer/footer.component'
import { HomeComponent } from './home/home.component'
import { NavbarComponent } from './navbar/navbar.component'
import { SharedModule } from 'shared/shared.module'

import { MaterialModule } from '../material/material.module'
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    // NgbModule,
    MaterialModule,
    RouterModule.forChild([])
  ],
  declarations: [NavbarComponent, FooterComponent, HomeComponent],
  exports: [NavbarComponent, FooterComponent]
})
export class CoreModule {}
