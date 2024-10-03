'use client'

import React, { useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { X, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { lockScroll, unlockScroll } from '@/utils/scrollLock'

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, clearCart, calculateTotal, updateQuantity } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      lockScroll()
    } else {
      unlockScroll()
    }

    return () => {
      unlockScroll()
    }
  }, [isOpen])

  const handleCheckout = () => {
    if (user) {
      router.push('/checkout')
    } else {
      router.push('/auth?redirect=checkout')
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="bg-white w-full max-w-md h-full p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close cart</span>
              </Button>
            </div>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center mb-4 border-b pb-4">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      width={80} 
                      height={80} 
                      className="rounded-md object-cover mr-4"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p>Size: {item.size}</p>
                      <div className="flex items-center mt-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => updateQuantity(item.id.toString(), item.size, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="text-white bg-black hover:bg-gray-800"
                        >
                          <Minus className="h-4 w-4" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => updateQuantity(item.id.toString(), item.size, item.quantity + 1)}
                          className="text-white bg-black hover:bg-gray-800"
                        >
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                      </div>
                      <p className="mt-2">Price: R{item.price.toFixed(2)}</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={() => removeFromCart(item.id.toString(), item.size)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <div className="mt-4">
                  <p className="font-bold text-xl mb-4">Total: R{calculateTotal().toFixed(2)}</p>
                  <div className="flex justify-between space-x-4">
                    <Button 
                      className="flex-1 bg-black text-white hover:bg-gray-800" 
                      onClick={handleCheckout}
                    >
                      Checkout
                    </Button>
                    <Button 
                      className="flex-1 bg-gray-200 text-black hover:bg-gray-300" 
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CartModal