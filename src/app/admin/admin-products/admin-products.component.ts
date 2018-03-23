import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core'
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material'
import { DomSanitizer } from '@angular/platform-browser'
import { ProductService, Product } from '../../shared/services/product.service'
/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, AfterViewInit {
  // displayedColumns = ['key', 'category', 'title', 'price', 'imageUrl']
  displayedColumns = ['title', 'action', 'category', 'price', 'image-url']
  dataSource: MatTableDataSource<Product>

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  // private _subscriptions: Subscription[] = []
  constructor(
    private productService: ProductService,
    private domSanitizer: DomSanitizer
  ) {
    this.dataSource = new MatTableDataSource<Product>([])
  }

  ngOnInit() {
    const data = this.productService.getListStatic()
    this.productService.getList().subscribe(products => {
      console.log(products)
      // this.dataSource.data = products
      this.dataSource.data = data
    })
  }

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
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
  }

  productCopyClicked(item) {
    console.log(`Copy requested for ${item.title}`)
  }

  productDeleteClicked(item) {
    console.log(`Delete requested for ${item.title}`)
  }
}
