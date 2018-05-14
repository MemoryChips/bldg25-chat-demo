import { Injectable } from '@angular/core'
// import 'rxjs/add/operator/take'
import { Observable, BehaviorSubject } from 'rxjs'
import { filter } from 'rxjs/operators'

import { Product } from 'shared/services/product.service'
import { HttpClient } from '@angular/common/http'

export interface Item {
  product: Product
  quantity: number
  key?: string
}

interface Items {
  [k: string]: Item
}

export class Cart {
  dateCreated = new Date().getTime()

  constructor(public items: Items = {}) {}

  get productIds(): string[] {
    return Object.keys(this.items)
  }

  get itemsList(): Item[] {
    return this.productIds.map(id => this.items[id])
  }

  get totalItemsCount() {
    let sum = 0
    Object.keys(this.items).forEach(key => (sum += this.items[key].quantity))
    return sum
  }

  get totalPrice() {
    let sum = 0
    Object.keys(this.items).forEach(
      key => (sum += this.items[key].quantity * this.items[key].product.price)
    )
    return sum
  }

  getQuantity(product: Product) {
    const item = this.items[product.key]
    return item ? item.quantity : 0
  }
}

@Injectable()
export class ShoppingCartService {
  private subject = new BehaviorSubject<Cart>(new Cart())
  cart$: Observable<Cart> = this.subject
    .asObservable()
    .pipe(filter((cart: Cart) => !!cart))
  private cart: Cart = new Cart()

  constructor(private http: HttpClient) {
    this.getCart().then(b => {
      console.log('cart is loaded: ', b)
      console.log('cart is now: ', this.cart)
    })
  }

  private setNewCart(uCart: any) {
    const newCart = new Cart(uCart.items || {})
    this.subject.next(newCart)
    this.cart = newCart
  }

  async updateItemQuantity(product: Product, change: number = 1) {
    if (!this.cart.items[product.key]) {
      this.cart.items[product.key] = { quantity: 0, product }
    }
    const item = this.cart.items[product.key]
    const quantity = (item ? item.quantity : 0) + change
    if (quantity <= 0) {
      delete this.cart.items[product.key]
    } else {
      this.cart.items[product.key].quantity = quantity
    }
    this.subject.next(this.cart)
    return this.getCartId().then(cartId => {
      return this.http
        .put<boolean>('/api/shopping-carts', { cartId, cart: this.cart })
        .subscribe(_success => {
          console.log('cart updated: ', _success)
          console.log('cart is now: ', this.cart)
        })
    })
  }

  async checkOut() {
    // TODO: Add checkout stuff here
    this.clearCart()
  }

  async clearCart() {
    const cartId = await this.getCartId()
    this.http
      .delete<{ success: boolean }>(`/api/shopping-carts/${cartId}`)
      .subscribe(resp => {
        if (resp.success) {
          console.log('Cart cleared:', cartId)
          localStorage.removeItem('cartId')
          this.getCartId().then(_cartId => {
            this.getCart().then(success => {
              console.log(`New cart setup: ${success}`)
            })
          })
        } else {
          console.log('Unable to clear cart.')
        }
      })
  }

  private async getCart(): Promise<boolean> {
    const cartId = await this.getCartId()
    return this.http
      .get<Cart>(`/api/shopping-carts/${cartId}`)
      .toPromise()
      .then(c => {
        this.setNewCart(c)
        return true
      })
  }

  private async createCartDb() {
    return this.http
      .post<string>('/api/shopping-carts', { newCart: new Cart() })
      .toPromise()
  }

  private setCartId(id: string) {
    localStorage.setItem('cartId', id)
  }

  private async getCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId')
    if (cartId) return cartId
    cartId = await this.createCartDb()
    this.setCartId(cartId)
    return cartId
  }
}
