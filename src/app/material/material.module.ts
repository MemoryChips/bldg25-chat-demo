import { NgModule } from '@angular/core'

import {
  MatButtonModule,
  MatToolbarModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatIconModule
} from '@angular/material'

const matModules = [
  MatButtonModule,
  MatToolbarModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatIconModule,
]

@NgModule({
  imports: matModules,
  exports: matModules,
})
export class MaterialModule {
}
