export interface order {
  id?: number
  subtotal?: number
  discount?: number
  shipping_cost?: number
  total?: number
  payment_status?: string
  payment_type?: string
  notes?:string
  status?: string
  status_text?: string
  address?: Address
  coupon?: Coupon
  created_at?: string
  order_details?: OrderDetail[]
}

export interface Address {
  id?: number
  user_id?: number
  lat?: any
  lng?: any
  address?: any
  f_name?: string
  l_name?: string
  phone?: string
  country_id?: number
  email?: string
  is_default?: number
  created_at?: string
  updated_at?: string
  city_id?: any
  country?: Country
}

export interface Country {
  id?: number
  title_ar?: string
  title_en?: string
  is_active?: number
  sort_order?: number
  shipping_cost?: number
  created_at?: string
  updated_at?: string
  title?: string
}

export interface Coupon {
  id?: number
  code?: string
  discount?: number
  type?: string
  start_date?: string
  end_date?: string
  is_active?: number
  created_at?: string
  updated_at?: string
  usage_count?: number
}

export interface OrderDetail {
  id?: number
  product_image?: string
  product_title?: string
  product_description?: string
  product_price?: number
  qty?: number
  total?: number
}
