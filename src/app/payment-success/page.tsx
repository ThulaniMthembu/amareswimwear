'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useCart } from '@/contexts/CartContext'

export default function PaymentSuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear the cart after successful payment
    clearCart()
  }, [clearCart])

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaff]">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-[#1c1c1c]">Payment Successful!</h1>
          <p className="text-xl mb-8 text-[#4a4a4a]">Thank you for your purchase. Your order has been confirmed.</p>
          <Button asChild className="bg-[#1c1c1c] text-white hover:bg-[#e87167] mr-4">
            <Link href="/profile">View Order</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}