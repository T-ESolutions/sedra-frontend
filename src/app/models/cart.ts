export interface cartData {
  cart: Cart[]
  total: number
  shipping: number
  discount: number
}

export interface Cart {
  id: number
  qty: number
  total: number
  product: Product
}

export interface Product {
  id: number
  title: string
  description: string
  attributes: string
  rate: number
  price: number
  discount: number
  price_after_discount: number
  categories: Category[]
  images: Image[]
}

export interface Category {
  id: number
  image: string
  title: string
}

export interface Image {
  id: number
  image: string
}
