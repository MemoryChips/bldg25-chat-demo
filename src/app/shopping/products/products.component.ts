import { Component, OnInit, OnDestroy } from '@angular/core'
import { ProductService, Product } from '../../shared/services/product.service'
import { ActivatedRoute } from '@angular/router'
import 'rxjs/add/operator/switchMap'
import { ShoppingCartService, Cart } from '../../shared/services/shopping-cart.service'
import { Subscription } from 'rxjs/Subscription'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  products: Product[] = []
  filteredProducts: Product[]
  categoryKey = ''
  cart: Cart

  private subscriptions: Subscription[]

  constructor(
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.populateProducts()
    const cart$ = await this.shoppingCartService.getCart()
    this.subscriptions = [
      cart$.subscribe(cart => this.cart = cart)
    ]
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  private populateProducts() {
    this.productService.getAll().switchMap((prods) => {
      this.products = prods
      return this.route.queryParamMap
    }).subscribe(params => {
      this.categoryKey = params.get('category')
      this.applyFilter()
    })
  }

  private applyFilter() {
    this.filteredProducts = (this.categoryKey) ?
      this.products.filter(p => p.category === this.categoryKey) :
      this.products
  }

}
