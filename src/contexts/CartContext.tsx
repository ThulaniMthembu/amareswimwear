'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type CartItem = {
  id: string | number
  name: string
  price: number
  quantity: number
  size: string
  image: string
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string | number, size: string) => void
  updateQuantity: (id: string | number, size: string, quantity: number) => void
  clearCart: () => void
  calculateTotal: () => number
  calculateSubtotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
      }
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, isInitialized])

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => 
        cartItem.id.toString() === item.id.toString() && cartItem.size === item.size
      )
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id.toString() === item.id.toString() && cartItem.size === item.size
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      }
      return [...prevCart, item]
    })
  }

  const removeFromCart = (id: string | number, size: string) => {
    setCart(prevCart => prevCart.filter(item => 
      !(item.id.toString() === id.toString() && item.size === size)
    ))
  }

  const updateQuantity = (id: string | number, size: string, quantity: number) => {
    setCart(prevCart => prevCart.map(item => 
      item.id.toString() === id.toString() && item.size === size 
        ? { ...item, quantity: Math.max(0, quantity) } 
        : item
    ))
  }

  const clearCart = () => {
    setCart([])
  }

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    // Add shipping or other costs here if needed
    return subtotal
  }

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      calculateTotal,
      calculateSubtotal 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}