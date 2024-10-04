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
  category: string
  tags: string[]
  stock: number
}

export interface Review {
  id: string
  productId: number
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
  updatedAt?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  createdAt: string
  phoneNumber?: string
  address?: string
}

export interface CartItem {
  id: string
  productId: number
  name: string
  price: number
  size: string
  quantity: number
  image: string
  totalPrice: number
}