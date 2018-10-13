import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MyOrdersComponent } from './my-orders.component'

import { of } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OrderService } from '../../shared/services/order.service'

class MockOrderService {}
class MockAuthService {
  user$ = of({})
  isLoggedIn$ = of(false)
}

describe('MyOrdersComponent', () => {
  let component: MyOrdersComponent
  let fixture: ComponentFixture<MyOrdersComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderService,
        { provide: OrderService, useClass: MockOrderService },
        { provide: AuthService, useClass: MockAuthService }
      ],
      declarations: [MyOrdersComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrdersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  afterEach(() => {
    fixture.destroy()
  })
})
