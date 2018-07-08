import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ShippingFormComponent } from './shipping-form.component'
import { RouterTestingModule } from '@angular/router/testing'

import { of } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OrderService } from '../../shared/services/order.service'
import { FormsModule } from '@angular/forms'

class MockOrderService {}
class MockAuthService {
  user$ = of({})
  isLoggedIn$ = of(false)
}

describe('ShippingFormComponent', () => {
  let component: ShippingFormComponent
  let fixture: ComponentFixture<ShippingFormComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      providers: [
        { provide: OrderService, useClass: MockOrderService },
        { provide: AuthService, useClass: MockAuthService }
      ],
      declarations: [ShippingFormComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
