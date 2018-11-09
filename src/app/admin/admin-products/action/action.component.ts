import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'

import { Product } from '../../../shared/services/product.service'

@Component({
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  @Input() data: Product
  @Input() column: any

  constructor(private router: Router) {}

  ngOnInit() {}

  editProductClicked() {
    this.router.navigate(['admin/products', this.data.key])
  }

  copyProductClicked() {
    this.router.navigate(['admin/products/copy', this.data.key])
  }
}
