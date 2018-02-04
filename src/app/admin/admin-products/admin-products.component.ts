import { AutoUnsubscribe } from '../../shared/utils'
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core'
import { ProductService, Product } from '../../shared/services/product.service'
import { OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs/Subscription'

import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material'

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
@AutoUnsubscribe
export class AdminProductsComponent implements OnInit, OnDestroy, AfterViewInit {

  displayedColumns = ['title', 'category', 'price', 'actions']
  dataSource = new MatTableDataSource<Product>()

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  sub$: Subscription
  constructor(private productService: ProductService) {}

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  ngOnDestroy() {
  }

  ngOnInit() {
    this.sub$ = this.productService.getList().subscribe(
      (products) => {
        this.dataSource.data = products
      })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

}
