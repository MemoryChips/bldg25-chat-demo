import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ShoppingCartComponent } from './shopping-cart.component'
import { ShoppingCartService, Cart } from '../../shared/services/shopping-cart.service'
import { ProductQuantityComponent } from '../../shared/components/product-quantity/product-quantity.component'

import { Observable, of } from 'rxjs'

class MockShoppingCartService {
  cart$: Observable<Cart> = of<Cart>(new Cart())
}

describe('ShoppingCartComponent', () => {
  let component: ShoppingCartComponent
  let fixture: ComponentFixture<ShoppingCartComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ShoppingCartService, useClass: MockShoppingCartService }],
      declarations: [ShoppingCartComponent, ProductQuantityComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
