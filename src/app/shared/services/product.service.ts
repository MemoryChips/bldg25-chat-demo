import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { Observable } from 'rxjs/Observable'

export interface Product {
  title: string
  price: number
  imageUrl: string
  category: string
  key?: string
}

export function addKey(items) {
  return items.map(item => ({ key: item.key, ...item.payload.val() }))
}

@Injectable()
export class ProductService {

  constructor(private db: AngularFireDatabase) { }

  create(product) {
    return this.db.list('/products').push(product)
  }

  getAll() {
    // return this.db.list('/products').valueChanges() as Observable<Product[]>
    return this.db.list('/products').snapshotChanges().map(addKey) as Observable<Product[]>
  }

  getProduct(productId: string) {
    return this.db.object('/products/' + productId).valueChanges() as Observable<Product>
  }

  update(productId: string, product: Product): Promise<any> {
    return this.db.object('/products/' + productId).update(product)
  }

  delete(productId: string): Promise<any> {
    return this.db.object('/products/' + productId).remove()
  }

}
