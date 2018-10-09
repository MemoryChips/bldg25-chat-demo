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
