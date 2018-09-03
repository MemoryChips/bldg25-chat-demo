import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { AuthService } from '../../auth/auth.service'
import { Cart } from '../../shared/services/shopping-cart.service'
import { OrderService, Order, Shipping } from '../../shared/services/order.service'

@Component({
  selector: 'app-shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.scss']
})
export class ShippingFormComponent implements OnInit, OnDestroy {
  @Input('cart')
  cart: Cart
  shipping: Shipping = {
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: ''
  }
  userSubscription: Subscription
  userId: string

  constructor(
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => (this.userId = user._id))
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe()
  }

  async placeOrder() {
    const order = new Order(this.userId, this.shipping, this.cart)
    const result = await this.orderService.placeOrder(order)
    if (result.success) {
      this.router.navigate(['/order-success', result.userId])
    }
  }
}
