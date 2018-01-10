import { Component, OnInit } from '@angular/core'
import { CategoryService, Category } from '../../../shared/services/category.service'
import { Input } from '@angular/core'

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {

  categories: Category[]
  @Input() categoryKey: string

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(cats => this.categories = cats)
  }

}
