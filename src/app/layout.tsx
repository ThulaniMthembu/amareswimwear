import React from 'react'
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
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={<Loader />}>
              {children}
            </Suspense>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}