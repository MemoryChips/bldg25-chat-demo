import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { addKey, values } from 'shared/utils'

import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'

// align models FE: product.service BE: product.api
export interface ProductWoKey {
  title: string
  price: number
  imageUrl: string
  category: string
}
export interface Product extends ProductWoKey {
  key: string
}

export interface Category {
  title: string
  lead: string
  key: string
}
// end align models

export interface Products {
  [key: string]: Product
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
