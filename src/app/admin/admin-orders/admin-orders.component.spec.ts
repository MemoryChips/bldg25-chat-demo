import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AdminOrdersComponent } from './admin-orders.component'

import { OrderService } from '../../shared/services/order.service'
// import { OrderService, Order } from '../../shared/services/order.service'
import { Observable, of } from 'rxjs'

class MockOrderService {
  getAllOrders(): Observable<string[][]> {
    return of([])
  }
}

describe('AdminOrdersComponent', () => {
  let component: AdminOrdersComponent
  let fixture: ComponentFixture<AdminOrdersComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminOrdersComponent],
      providers: [{ provide: OrderService, useClass: MockOrderService }]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrdersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
