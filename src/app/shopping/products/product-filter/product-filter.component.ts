import { Component, OnInit } from '@angular/core'
import { ProductService, Category } from 'shared/services/product.service'
import { Input } from '@angular/core'

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {
  categories: Category[]
  @Input() categoryKey: string

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService
      .getCategories()
      .subscribe(cats => (this.categories = cats))
  }
}
