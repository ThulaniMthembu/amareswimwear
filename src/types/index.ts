export interface Product {
  id: number
  name: string
  price: number
  image: string
  hoverImage: string
  sizes: string[]
  description: string
  reviews: Review[]
  averageRating: number
}

export interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  size: string
  quantity: number
  image: string
}