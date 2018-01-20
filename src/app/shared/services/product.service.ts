import { Injectable } from '@angular/core'
// import { Observable } from 'rxjs/Observable'
import { HttpClient } from '@angular/common/http'
import { addKey, values, KeyedObj } from 'shared/utils'

export interface Product {
  title: string
  price: number
  imageUrl: string
  category: string
  key?: string
}

export interface Category {
  title: string,
  lead: string,
  key?: string
}

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }

  create(product) {
    return this.http.put('/api/products', product)
  }

  getAll() {
    return this.http.get<KeyedObj<Product>>('/api/products')
  }

  getList() {
    // return this.getAll().map(addKey).map(values)
    return this.getAll().map(addKey).map(values)
  }

  get(productId: string) {
    return this.http.get<Product>('/api/products/' + productId)
  }

  update(productId: string, product: Product) {
    return this.http.post<Product>('/api/products/' + productId, product)
  }

  delete(productId: string) {
    return this.http.delete('/api/products/' + productId)
  }

  getCategories() {
    // return this.db.list('/categories', ref => ref.orderByChild('title')).valueChanges()
    return this.http.get<KeyedObj<Category>>('/api/categories').map(addKey).map(values)
  }

}
