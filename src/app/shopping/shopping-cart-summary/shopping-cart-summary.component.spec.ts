import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ShoppingCartSummaryComponent } from './shopping-cart-summary.component'
import { Cart } from '../../shared/services/shopping-cart.service'

const exampleCart: Cart = new Cart()

describe('ShoppingCartSummaryComponent', () => {
  let component: ShoppingCartSummaryComponent
  let fixture: ComponentFixture<ShoppingCartSummaryComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShoppingCartSummaryComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartSummaryComponent)
    component = fixture.componentInstance
    component.cart = exampleCart
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
