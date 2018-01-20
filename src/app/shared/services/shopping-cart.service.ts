import { Injectable } from '@angular/core'
// import { AngularFireDatabase } from 'angularfire2/database'
import 'rxjs/add/operator/take'
import { Observable } from 'rxjs/Observable'
import { Product } from 'shared/services/product.service'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
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

  constructor(public items: Items = {}) { }

  get productIds(): string[] {
    return Object.keys(this.items)
  }

  get itemsList(): Item[] {
    return this.productIds.map(id => this.items[id])
  }

  get totalItemsCount() {
    let sum = 0
    Object.keys(this.items).forEach(key => sum += this.items[key].quantity)
    return sum
  }

  get totalPrice() {
    let sum = 0
    Object.keys(this.items).forEach(key =>
      sum += this.items[key].quantity * this.items[key].product.price)
    return sum
  }

  getQuantity(product: Product) {
    const item = this.items[product.key]
    return item ? item.quantity : 0
  }

}

@Injectable()
export class ShoppingCartService {

  private subject = new BehaviorSubject<Cart>(undefined)
  cart$: Observable<Cart> = this.subject.asObservable().filter(cart => !!cart)
  private cart: Cart = undefined

  constructor(private http: HttpClient) {
    this.getCart().then(b => {
      console.log('cart is loaded: ', b)
    })
  }

  private setNewCart(uCart: any) {
    const newCart = new Cart(uCart.items || {})
    this.subject.next(newCart)
    this.cart = newCart
  }

  async updateItemQuantity(product: Product, change: number = 1) {
    const cartId = await this.getCartId()
    // const cart = await this.getCart()
    const item = this.cart.items[product.key]
    const quantity = (item ? item.quantity : 0) + change
    if (quantity <= 0) {
      this.http.delete(`/api/shopping-carts/item?cartid=${cartId}&key=${product.key}`)
        .subscribe((uCart) => {
          console.log(`Item removed from cart result ${uCart}:`, cartId, product.key)
          this.setNewCart(uCart)
        })
    } else {
      const updateItem: Item = {
        product: product,
        quantity,
        key: product.key
      }
      this.http.put<Cart>('/api/shopping-carts/item', { cartId, updateItem })
        .subscribe((uCart) => {
          console.log('Item put into cart:', uCart)
          this.setNewCart(uCart)
        })
    }
  }

  // TODO: Have backend return a new empty cart
  async checkOut() {
    // TODO: Add checkout stuff here
    this.clearCart()
  }

  // TODO: Have backend return a new empty cart
  async clearCart() {
    const cartId = await this.getCartId()
    this.http.delete<string>(`/api/shopping-carts/${cartId}`)
      .subscribe((newCartId) => {
        console.log('Cart cleared:', cartId)
        this.setCartId(newCartId)
        this.getCart()
      })
  }

  private async getCart(): Promise<boolean> {
    const cartId = await this.getCartId()
    this.http.get<any>(`/api/shopping-carts/${cartId}`)
      // .map(cart => new Cart(cart ? cart.items || {} : {}))
      .subscribe(c => {
        this.setNewCart(c)
        // this.cart = c
      })
    return true
  }

  private async createCartDb() {
    return this.http.put<string>('/api/shopping-carts', {}).toPromise()
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
