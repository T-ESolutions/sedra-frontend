export interface product {
  id?: number
  title?: string
  description?: string
  short_description?: string
  attributes?: string
  video_url?: string
  rate?: number
  price?: number
  discount?: number
  price_after_discount?: number
  categories?: Category[]
  images?: Image[]
  qty_in_cart?:number
  cart_id?:any
}

export interface Category {
  id: number
  image: string
  title: string
}

export interface Image {
  id?: number
  image?: string
}


export interface cart {
  cart: [
    cart: {}
  ]
  total: number
  shipping: number
  discount: number
}


