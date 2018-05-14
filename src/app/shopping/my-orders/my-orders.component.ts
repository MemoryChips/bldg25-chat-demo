import { Component } from '@angular/core'
import { AuthService, AppUser } from '../../auth/auth.service'
import { OrderService, Order } from '../../shared/services/order.service'
import { Observable } from 'rxjs'
import { switchMap } from 'rxjs/operators'

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent {
  orders$: Observable<Order[]>

  constructor(authService: AuthService, orderService: OrderService) {
    this.orders$ = authService.user$.pipe(
      switchMap((_u: AppUser) => orderService.getOrdersByUser())
    )
  }
}
