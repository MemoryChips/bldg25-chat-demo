import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProductsComponent } from './products.component'
import { ProductService } from 'shared/services/product.service'
import { ShoppingCartService } from 'shared/services/shopping-cart.service'
import { ActivatedRoute } from '@angular/router'
import { NO_ERRORS_SCHEMA } from '@angular/core'

//   private productService: ProductService,
// private shoppingCartService: ShoppingCartService,
//   private route: ActivatedRoute

class MockProductService {}
class MockShoppingCartService {}
class MockActivatedRoute {}

describe('ProductsComponent', () => {
  let component: ProductsComponent
  let fixture: ComponentFixture<ProductsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: ShoppingCartService, useClass: MockShoppingCartService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ],
      declarations: [ProductsComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
