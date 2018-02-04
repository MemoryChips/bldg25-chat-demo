import { Component } from '@angular/core'
import 'rxjs/add/operator/switchMap'
import { AuthService } from '../../auth/auth.service'
import { OrderService, Order } from '../../shared/services/order.service'
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent {
  orders$: Observable<Order[]>

  constructor(
    authService: AuthService,
    orderService: OrderService
  ) {
    this.orders$ = authService.user$.switchMap(_u => orderService.getOrdersByUser())
  }
}
