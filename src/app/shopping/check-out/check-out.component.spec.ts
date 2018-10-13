import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { CheckOutComponent } from './check-out.component'
// import { ShippingFormComponent } from '../shipping-form/shipping-form.component'
// import { ShoppingCartSummaryComponent } from '../shopping-cart-summary/shopping-cart-summary.component'

import { ShoppingCartService, Cart } from 'shared/services/shopping-cart.service'
import { Observable, of } from 'rxjs'
class MockShoppingCartService {
  cart$: Observable<Cart> = of<Cart>(new Cart())
}

describe('CheckOutComponent', () => {
  let component: CheckOutComponent
  let fixture: ComponentFixture<CheckOutComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule],
      providers: [{ provide: ShoppingCartService, useClass: MockShoppingCartService }],
      declarations: [
        CheckOutComponent
        // ShippingFormComponent,
        // ShoppingCartSummaryComponent
      ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckOutComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
