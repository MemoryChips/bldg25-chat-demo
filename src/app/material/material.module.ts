import { NgModule } from '@angular/core'
import { CdkTableModule } from '@angular/cdk/table'
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
  MatGridListModule,
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
  MatGridListModule,
  CdkTableModule
]

@NgModule({
  imports: matModules,
  exports: matModules,
})
export class MaterialModule {
}
