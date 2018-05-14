import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { addKey, values } from 'shared/utils'

import { map } from 'rxjs/operators'

export interface Product {
  title: string
  price: number
  imageUrl: string
  category: string
  key: string
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

  getAll() {
    return this.http.get<any>('/api/product/all')
  }

  getList() {
    return this.getAll().pipe<any>(map(addKey), map(values))
    // return this.getAll()
    //   .map(addKey)
    //   .map(values)
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

  // getListStatic() {
  //   const products: Product[] = values(addKey(oproducts))
  //   return products
  // }
}

// tslint:disable:max-line-length
// const oproducts: { [key: string]: Product } = {
//   '-L0V4jyvXq9qR9cNTenO': {
//     title: 'Taxonomy Services Extra',
//     price: 5,
//     category: 'database',
//     imageUrl: 'https://c1.staticflickr.com/8/7019/6596766449_851d5bff3e_b.jpg'
//   },
//   '-L0VdmFZvHL3o0X7IKzu': {
//     title: 'Web App Testing Lite',
//     price: 10,
//     category: 'web-dev',
//     imageUrl: 'http://localhost:9000/image-files/race-car.jpg'
//   },
//   '-L0VdmFZvHL3o0X7Iavc': {
//     title: 'Web App Testing',
//     price: 10,
//     category: 'manpower',
//     imageUrl: 'http://localhost:9000/image-files/jet-takeoff.jpg'
//   },
//   '-L0ZiFWvItP4YFXtYEH_': {
//     category: 'web-dev',
//     imageUrl:
//       'https://upload.wikimedia.org/wikipedia/commons/0/0c/Wordpress_logo_8.png',
//     price: 22,
//     title: 'Wordpress Sites'
//   },
//   '-KrqgOLs07ZkbapP4EGi': {
//     title: 'Spinach',
//     price: 2.5,
//     category: 'organic',
//     imageUrl:
//       'http://www.publicdomainpictures.net/pictures/170000/velka/spinach-leaves-1461774375kTU.jpg'
//   },
//   '-KrrIkDT19XhPgWo0T0A': {
//     title: 'Freshly Baked Bread',
//     price: 3,
//     category: 'organic',
//     imageUrl:
//       'https://static.pexels.com/photos/2434/bread-food-healthy-breakfast.jpg'
//   },
//   '-KrvrXbV3rqnFEru_ojw': {
//     title: 'Avacado',
//     price: 1.75,
//     category: 'organic',
//     imageUrl: 'http://localhost:9000/image-files/avocado.jpg'
//   },
//   '-KrvrgogC3oac5k83Awt': {
//     title: 'Tomato',
//     price: 2.5,
//     category: 'organic',
//     imageUrl: 'http://localhost:9000/image-files/food-wood-tomatoes.jpg'
//   },
//   '-Krvrt2nkeRw2HCbiGDj': {
//     title: 'Lettuce',
//     price: 1,
//     category: 'organic',
//     imageUrl:
//       'https://upload.wikimedia.org/wikipedia/commons/7/7f/Lettuce_Mini_Heads_%287331119710%29.jpg'
//   },
//   '-Krvs0ZZBpz5GuM0RfC8': {
//     title: 'Cauliflower',
//     price: 1.75,
//     category: 'organic',
//     imageUrl:
//       'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Cauliflowers_-_20051021.jpg/1280px-Cauliflowers_-_20051021.jpg'
//   },
//   '-Krvs7RuXkSiDZvBZmey': {
//     title: 'Banana',
//     price: 1.25,
//     category: 'organic',
//     imageUrl:
//       'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Bananas.jpg/1024px-Bananas.jpg'
//   },
//   '-KrvsKZbI_mpo3hJg7G7': {
//     title: 'Orange',
//     price: 1.7,
//     category: 'organic',
//     imageUrl:
//       'https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg'
//   },
//   '-KrvsRNOg-ftEUM3Te-F': {
//     title: 'Apple',
//     price: 2,
//     category: 'organic',
//     imageUrl:
//       'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg'
//   },
//   '-Krvs_CiDXdiZ3yd0PUp': {
//     title: 'Grape',
//     price: 2,
//     category: 'organic',
//     imageUrl:
//       'https://upload.wikimedia.org/wikipedia/commons/3/36/Kyoho-grape.jpg'
//   },
//   '-KrvsfKjGc0NCM0prc0I': {
//     category: 'database',
//     imageUrl:
//       'https://upload.wikimedia.org/wikipedia/commons/9/9e/Autumn_Red_peaches.jpg',
//     price: 2,
//     title: 'Peach'
//   },
//   '-KrvsrmX3I1-Bo6eFCdx': {
//     title: 'Cinnamon Sticks',
//     price: 0.5,
//     category: 'organic',
//     imageUrl:
//       'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cinnamon-other.jpg'
//   },
//   '-KrvsxvxOmTzMXOSx7iG': {
//     category: 'database',
//     imageUrl:
//       'https://upload.wikimedia.org/wikipedia/commons/4/48/Saffron_Crop.JPG',
//     price: 3,
//     title: 'Saffron'
//   },
//   '-Krvt8G_naLT8Pg_Fob6': {
//     title: 'Ground Turmeric',
//     price: 0.75,
//     category: 'organic',
//     imageUrl: 'http://localhost:9000/image-files/ladies.jpg'
//   },
//   '-KrvtXWZvGv-mr0IFbAA': {
//     title: 'Coriander Seeds',
//     price: 0.5,
//     category: 'organic',
//     imageUrl: 'http://localhost:9000/image-files/ladies.jpg'
//   },
//   '-Krvtvc_uQyh6dzI-J3R': {
//     title: 'Lavash Bread',
//     price: 1.25,
//     category: 'organic',
//     imageUrl:
//       'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Fabrication_du_lavash_%C3%A0_Noravank_%286%29.jpg/1280px-Fabrication_du_lavash_%C3%A0_Noravank_%286%29.jpg'
//   },
//   '-Krvu3aL-m-ku0yCnQGr': {
//     title: 'Bagel Bread',
//     price: 1,
//     category: 'organic',
//     imageUrl:
//       'https://upload.wikimedia.org/wikipedia/commons/1/1d/Bagel-Plain-Alt.jpg'
//   },
//   '-KrvuH_bkBBZDW0NCwfl': {
//     title: 'Strawberry',
//     price: 1.95,
//     category: 'organic',
//     imageUrl:
//       'https://upload.wikimedia.org/wikipedia/commons/e/e1/Strawberries.jpg'
//   },
//   '-KrvuT7GtYfsFvmQfgoj': {
//     title: 'Baguette Bread',
//     price: 1.25,
//     category: 'organic',
//     imageUrl: 'https://static.pexels.com/photos/416607/pexels-photo-416607.jpeg'
//   },
//   b6jdylzpctrjd0gis44: {
//     title: 'Web App Testing Heavy',
//     price: 34,
//     category: 'database',
//     imageUrl: 'https://c2.staticflickr.com/4/3900/15090882332_bfedb55793_b.jpg'
//   }
// }
