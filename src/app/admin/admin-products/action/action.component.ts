import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'

import { CellComponent } from 'ng5-data-table'

import { Product } from '../../../shared/services/product.service'

@Component({
  // selector: 'chat-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit, CellComponent {

  @Input() data: Product
  @Input() column: any

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  editProductClicked() {
    this.router.navigate(['admin/products', this.data.key])
  }

  copyProductClicked() {
    this.router.navigate(['admin/products/copy', this.data.key])
  }

}
