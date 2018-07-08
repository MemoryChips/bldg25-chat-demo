import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ShoppingCartService, Cart } from '../../services/shopping-cart.service'
import { Product } from 'shared/services/product.service'
import { ProductQuantityComponent } from './product-quantity.component'

class MockShoppingCartService {}

const exampleCart: Cart = new Cart()
const exampleProduct: Product = {
  title: 'example product',
  price: 42,
  imageUrl: '',
  category: 'exampleCategory',
  key: 'xyz'
}

describe('ProductQuantityComponent', () => {
  let component: ProductQuantityComponent
  let fixture: ComponentFixture<ProductQuantityComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ShoppingCartService, useClass: MockShoppingCartService }
      ],
      declarations: [ProductQuantityComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductQuantityComponent)
    component = fixture.componentInstance
    component.cart = exampleCart
    component.product = exampleProduct
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
