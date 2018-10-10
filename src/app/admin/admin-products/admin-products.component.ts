import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material'
import { DomSanitizer } from '@angular/platform-browser'
import { ProductService, Product } from '../../shared/services/product.service'
import { Subscription } from 'rxjs'

// import { Item } from '../../shared/services/shopping-cart.service'

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  // displayedColumns = ['key', 'category', 'title', 'price', 'imageUrl']
  displayedColumns = ['title', 'action', 'category', 'price', 'image-url']
  dataSource: MatTableDataSource<Product>

  @ViewChild(MatPaginator)
  paginator: MatPaginator
  @ViewChild(MatSort)
  sort: MatSort

  private _subscriptions: Subscription[] = []
  constructor(
    private productService: ProductService,
    private domSanitizer: DomSanitizer,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<Product>([])
  }

  ngOnInit() {
    // const data = this.productService.getListStatic()
    this._subscriptions = [
      this.productService.getIndexedList().subscribe((products: any) => {
        // TODO: use Product instead of any
        this.dataSource.data = products
        // this.dataSource.data = data
      })
    ]
  }

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  ngOnDestroy() {
    this._subscriptions.forEach(s => s.unsubscribe())
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim() // Remove whitespace
    filterValue = filterValue.toLowerCase() // Datasource defaults to lowercase matches
    // this.dataSource.filter = ` ${filterValue}` // to force data source to filter
    this.dataSource.filter = filterValue
  }

  sanitize(imageUrl: string) {
    return this.domSanitizer.bypassSecurityTrustStyle(`url(${imageUrl})`)
  }

  productEditClicked(item: Product) {
    console.log(`Edit requested for ${item.title} with id ${item.key}`)
    this.router.navigate(['admin/products', item.key])
  }

  productCopyClicked(item: Product) {
    console.log(`Copy requested for ${item.title}`)
    this.router.navigate(['admin/products/copy', item.key])
  }

  productDeleteClicked(item: Product) {
    console.log(`Delete requested for ${item.title} - this method is not complete.`)
  }

  resetAllProductsRequest() {
    console.log(`Reset all products data requested.`)
    this.productService.resetAll().subscribe(resp => {
      console.log(`Response to reset all products: ${resp}`)
    })
  }
}
