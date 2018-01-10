import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import 'rxjs/add/operator/take'
import { Observable } from 'rxjs/Observable'
import { Product } from 'shared/services/product.service'

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

  constructor(private items: Items = {}) {}

  get productIds(): string[] {
    return Object.keys(this.items)
  }

  get itemsList(): Item[]{
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

  constructor(private db: AngularFireDatabase) { }

  async updateItemQuantity(product: Product, change: number = 1) {
    const cartId = await this.getCartId()
    const item$ = this.getCartItem(cartId, product.key)
    item$.take(1).subscribe(item => {
      const quantity = (item ? item.quantity : 0) + change
      if (quantity <= 0) {
        this.db.object('/shopping-carts/' + cartId + '/items/' + product.key).remove()
      } else {
        const newItem: Item = {
          product: product,
          quantity
        }
        this.db.object('/shopping-carts/' + cartId + '/items/' + product.key).update(newItem)
      }
    })
  }

  async checkOut() {
    const cartId = await this.getCartId()
    this.db.object('/shopping-carts/' + cartId + '/items').remove()
  }

  async clearCart() {
    const cartId = await this.getCartId()
    this.db.object('/shopping-carts/' + cartId + '/items').remove()
  }

  async getCart(): Promise<Observable<Cart>> {
    const cartId = await this.getCartId()
    const fbCart = this.db.object('/shopping-carts/' + cartId).valueChanges() as Observable<any>
    return fbCart.map(cart => new Cart(cart ? cart.items || {} : {} ))
  }

  private createCartDb() {
    return this.db.list('/shopping-carts').push(new Cart())
  }

  private getCartItem(cartId: string, productKey: string): Observable<Item> {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productKey).valueChanges() as Observable<Item>
  }

  private async getCartId(): Promise<string> {
    const cartId = localStorage.getItem('cartId')
    if (cartId) return cartId
    const cart = await this.createCartDb()
    localStorage.setItem('cartId', cart.key)
    return cart.key
  }

}
