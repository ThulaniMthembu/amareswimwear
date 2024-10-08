'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function PaymentCancelledPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafaff]">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-[#1c1c1c]">Payment Cancelled</h1>
          <p className="text-xl mb-8 text-[#4a4a4a]">Your payment was cancelled. If you experienced any issues, please try again or contact our support team.</p>
          <Button asChild className="bg-[#1c1c1c] text-white hover:bg-[#e87167] mr-4">
            <Link href="/checkout">Try Again</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}