import { Injectable } from '@angular/core'
import { Cart, ShoppingCartService } from './shopping-cart.service'
// import { AngularFireDatabase } from 'angularfire2/database'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
// import { addKey, values, KeyedObj } from 'shared/utils'
// import { addKey, values } from 'shared/utils'

export class Order {
  datePlaced: number
  items: any[]

  constructor(public userId: string, public shipping: any, shoppingCart: Cart) {
    this.datePlaced = new Date().getTime()

    this.items = shoppingCart.itemsList.map(i => {
      return {
        product: {
          title: i.product.title,
          imageUrl: i.product.imageUrl,
          price: i.product.price
        },
        quantity: i.quantity,
        totalPrice: i.product.price * i.quantity
      }
    })
  }
}

export interface Shipping {
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
}
@Injectable()
export class OrderService {
  constructor(
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService
  ) {}

  async placeOrder(order: Order) {
    const result = await this.http
      .post<{ success: boolean; userId: string }>('/api/order', order)
      .toPromise()
    this.shoppingCartService.clearCart() // this should be a transaction
    return result
  }

  getAllOrders() {
    return this.http.get<string[][]>('/api/order/allOrders')
  }

  getOrdersByUser(): Observable<Order[]> {
    return this.http.get<string[]>('/api/order/myOrders').pipe(
      map(sOrders => {
        const orders = sOrders.map(sOrder => {
          return JSON.parse(sOrder) as Order
        })
        return orders
      })
    )
  }
}
