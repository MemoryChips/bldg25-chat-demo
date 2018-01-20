import { Injectable } from '@angular/core'
import { Cart, ShoppingCartService } from './shopping-cart.service'
// import { AngularFireDatabase } from 'angularfire2/database'
import { Observable } from 'rxjs/Observable'
import { HttpClient } from '@angular/common/http'
import { addKey, values, KeyedObj } from 'shared/utils'

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
  ) { }

  async placeOrder(order: Order) {
    const result = await this.http.post<string>('/orders', order).toPromise()
    this.shoppingCartService.clearCart()  // this should be a transaction
    return result
  }
  // placeOrder(order: Order) {
  //   const result = this.db.list('/orders').push(order).then(
  //     () => { this.shoppingCartService.clearCart() },
  //     (err) => { console.error('There was a problem with the order: ', err) }
  //   )
  //   return result
  // }

  getOrders() {
    return this.http.get<{[key: string]: Order}>('/orders').map(addKey).map(values)
  }

  getOrdersByUser(userId: string): Observable<Order[]> {
    return this.http.get<KeyedObj<Order>>('/api/orders/' + userId )
      .map(addKey).map(values)
  }
}
