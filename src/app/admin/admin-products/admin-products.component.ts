import { Component, OnInit, OnDestroy } from '@angular/core'
// import { Router } from '@angular/router'
import { DataTableConfig, DataTableService, Column } from 'ng5-data-table'

import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'

import { Product, ProductService } from '../../shared/services/product.service'
import { ActionComponent } from 'app/admin/admin-products/action/action.component'

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
    // private router: Router
  ) { }

  ngOnInit() {
    const data$: Observable<Product[]> = this.productService.getList()
    this.dataTableService.createCellComponents([ActionComponent])
    const columns: (Column | string)[] = [
      'title',
      {
        key: 'price',
        useCurrencyPipe: true,
        width: '80px',
        sortable: true,
      },
      {
        key: 'category',
        sortable: true,
        width: '100px',
      },
      {
        key: 'imageUrl',
        title: 'Image',
        width: '55px'
      },
      // example of a column with no data
      {
        key: 'action',
        // component: 'ActionComponent',  // either way
        // component: ActionComponent.name,  // maybe safer since no typos
        component: ActionComponent,  // can also just pass the component type itself
        title: 'Action',
        width: '150px',
      },
    ]
    const partialConfig: DataTableConfig = {
      headerConfig: {
        actionLinks: [
          {
            actionRoute: '/admin/products/new',
            actionLinkText: 'New Service',
            minSelections: 0,
            maxSelections: 9999
          }
        ],
      },
      tableConfig: {
        header: true,
      }
    }
    this.tableId = this.dataTableService.createDataTableState(data$, columns, partialConfig)
    this._subscriptions = [
      this.dataTableService.getDataTableState(this.tableId).uiState$.subscribe(uiState => {
        this.selectedRowIds = uiState.selectedRows
      }),
    ]
  }

  ngOnDestroy() {
    this._subscriptions.forEach(s => s.unsubscribe())
  }

  // editProductClicked(product) {
  //   this.router.navigate(['admin/products', product.key])
  // }

  // copyProductClicked(product: Product) {
  //   this.router.navigate(['admin/products/copy', product.key])
  // }

}
