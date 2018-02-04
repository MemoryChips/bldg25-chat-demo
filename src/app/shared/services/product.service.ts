import { Injectable } from '@angular/core'
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
    return this.http.post<boolean>('/api/product/new-product', product)
  }

  getAll() {
    return this.http.get<KeyedObj<Product>>('/api/product/all')
  }

  getList() {
    return this.getAll().map(addKey).map(values)
  }

  get(productId: string) {
    return this.http.get<Product>('/api/product/' + productId)
  }

  update(productId: string, product: Product) {
    return this.http.put<Product>('/api/product/' + productId, product)
  }

  delete(productId: string) {
    return this.http.delete('/api/product/' + productId)
  }

  getCategories() {
    return this.http.get<KeyedObj<Category>>('/api/product/categories')
      .map(addKey)
      .map(values)
      .map((cats) => {
        return cats.sort((a, b) => {
          const x = a.title.toLowerCase()
          const y = b.title.toLowerCase()
          return ((x < y) ? -1 : ((x > y) ? 1 : 0))
        })
      })
  }

}
