import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core'
import { ProductService } from '../../services/product.service'
import { Product } from '../../models/product'
import { OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs/Subscription'

import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material'

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, OnDestroy, AfterViewInit {

  displayedColumns = ['title', 'category', 'price', 'actions']
  dataSource = new MatTableDataSource<Product>()

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  private sub: Subscription
  constructor(private productService: ProductService) {}

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }
  ngOnDestroy() {
    this.sub.unsubscribe()
  }
  ngOnInit() {
    this.sub = this.productService.getAll().subscribe(
      (products) => {
        this.dataSource.data = products
      })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  // filter(query: string) {
  //   this.products = (query) ?
  //     this.unFilteredProducts.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) :
  //     this.unFilteredProducts
  // }
}
