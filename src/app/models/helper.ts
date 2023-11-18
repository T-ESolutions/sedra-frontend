export interface page {
  id?: number
  image?: string
  title?: string
  body?: string
}


export type settings = setting[]

export interface setting{
  id?: number
  key?: string
  value?: string
  image?: string
}


export interface address {
  id?: number
  address?: string
  f_name?: string
  l_name?: string
  phone?: string
  country_id?: number
  country_title?: string
  city_id?: number
  city_title?: string
  city_shipping_cost?: number
  email?: string
  is_default?: number,
  country_shipping_cost?: number
}
