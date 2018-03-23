import { NgModule } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
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
  MatFormFieldModule,
  MatButtonToggleModule,
  MatTooltipModule
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
  CdkTableModule,
  MatFormFieldModule,
  MatButtonToggleModule,
  MatTooltipModule,
  BrowserAnimationsModule
]

@NgModule({
  imports: matModules,
  exports: matModules
})
export class MaterialModule {}
