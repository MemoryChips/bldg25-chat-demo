import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { DataTableConfig, DataTableService } from 'ng5-data-table' // for prod

import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'

import { Product, ProductService } from '../../shared/services/product.service'

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  tableId: string
  selectedRowIds: string[] = []

  private _subscriptions: Subscription[] = []
  constructor(
    private productService: ProductService,
    private dataTableService: DataTableService,
    private router: Router
  ) { }

  ngOnInit() {
    const data$: Observable<Product[]> = this.productService.getList()
    const partialConfig: DataTableConfig = {
      headerConfig: {
        actionLinkText: 'New Service',
        actionLink: '/admin/products/new',
        headerTitle: 'Products and Services',
      },
      tableConfig: {
        header: true,
        multiSelect: true,
        selectColumn: true,
        selectOnRowClick: true,
      }
    }
    this.tableId = this.dataTableService.createDataTableState(partialConfig, data$)
    this._subscriptions = [
      this.dataTableService.getDataTableState(this.tableId).uiState$.subscribe(uiState => {
        this.selectedRowIds = uiState.selectedRows
      }),
    ]
  }

  ngOnDestroy() {
    this._subscriptions.forEach(s => s.unsubscribe())
  }

  // custom features:
  editProductClicked(product) {
    this.router.navigate(['admin/products', product.key])
  }

  copyProductClicked(product: Product) {
    this.router.navigate(['admin/products/copy', product.key])
  }

}
