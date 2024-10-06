'use client'

import React, { useState, useEffect } from 'react'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { Loader } from '@/components/Loader'
import { Suspense } from 'react'
import type { Metadata } from 'next'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Amare Swimwear',
  description: 'Embrace your beauty with Amare Swimwear',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Adjust this value to control how long the loader is shown

    return () => clearTimeout(timer)
  }, [])

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {isLoading ? (
              <Loader />
            ) : (
              <Suspense fallback={<Loader />}>
                {children}
              </Suspense>
            )}
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}