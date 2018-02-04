import { Component } from '@angular/core'
import { OrderService, Order } from '../../shared/services/order.service'
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent {
  orders$: Observable<Order[]>

  constructor(orderService: OrderService) {
    this.orders$ = orderService.getAllOrders().map((orderArrays: string[][]) => {
      return [].concat.apply([], orderArrays).map(order => JSON.parse(order) as Order)
    })
  }
}
