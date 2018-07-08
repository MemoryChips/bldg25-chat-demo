import {
  // async,
  ComponentFixture,
  TestBed,
  fakeAsync
} from '@angular/core/testing'

import { ProductCardComponent } from './product-card.component'
import { ShoppingCartService, Cart } from '../../services/shopping-cart.service'
import { Product } from 'shared/services/product.service'
import { ProductQuantityComponent } from '../product-quantity/product-quantity.component'
class MockShoppingCartService {}

const exampleCart: Cart = new Cart()
const exampleProduct: Product = {
  title: 'example product',
  price: 42,
  imageUrl: '',
  category: 'exampleCategory',
  key: 'xyz'
}
describe('ProductCardComponent', () => {
  let component: ProductCardComponent
  let fixture: ComponentFixture<ProductCardComponent>

  beforeEach(
    fakeAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: ShoppingCartService, useClass: MockShoppingCartService }
        ],
        declarations: [ProductCardComponent, ProductQuantityComponent]
      }).compileComponents()
    })
  )

  beforeEach(
    fakeAsync(() => {
      fixture = TestBed.createComponent(ProductCardComponent)
      component = fixture.componentInstance
      component.cart = exampleCart
      component.product = exampleProduct
      fixture.detectChanges()
    })
  )

  it(
    'should create',
    fakeAsync(() => {
      expect(component).toBeTruthy()
    })
  )
})
