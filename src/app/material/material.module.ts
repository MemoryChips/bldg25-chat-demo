import { NgModule } from '@angular/core'

import {
  MatButtonModule,
  MatToolbarModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatIconModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatSnackBarModule,
  MatExpansionModule,
  MatTabsModule,
  MatGridListModule
} from '@angular/material'

const matModules = [
  MatButtonModule,
  MatToolbarModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatIconModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatSnackBarModule,
  MatExpansionModule,
  MatTabsModule,
  MatGridListModule
]

@NgModule({
  imports: matModules,
  exports: matModules,
})
export class MaterialModule {
}
