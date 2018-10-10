import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { addKey, values } from 'shared/utils'

import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'

// import { Product, Category } from '../../../../shared/products'
export interface Product {
  title: string
  price: number
  imageUrl: string
  category: string
  key: string
}

export interface Products {
  [key: string]: Product
}

export interface Category {
  title: string
  lead: string
  key?: string
}

@Injectable()
export class ProductService {
  constructor(private http: HttpClient) {}

  create(product: Product) {
    return this.http.post<boolean>('/api/product/new-product', product)
  }

  getList() {
    return this.http.get<Product[]>('/api/product/all')
  }

  resetAll() {
    return this.http.post<any>('/api/product/reset-all-products', '')
  }

  getIndexedList(): Observable<Products> {
    return this.getList().pipe(
      map(products => {
        const newProducts: Products = {}
        products.forEach(p => (newProducts[p.key] = p))
        return newProducts
      })
    )
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
    return this.http.get<any>('/api/product/categories').pipe(
      map(addKey),
      map(values),
      map((cats: Category[]) => {
        return cats.sort((a: Category, b: Category) => {
          const x = a.title.toLowerCase()
          const y = b.title.toLowerCase()
          return x < y ? -1 : x > y ? 1 : 0
        })
      })
    )
  }
}
