import React from 'react'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import ClientLayout from './ClientLayout'
import type { Metadata } from 'next'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Amare Swim Resort',
  description: 'Embrace luxury and comfort with Amare Swim Resort',
  keywords: ['swimwear', 'resort wear', 'luxury', 'beach fashion'],
  authors: [{ name: 'Amare Swim Resort' }],
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://amareswimwear.vercel.app',
    siteName: 'Amare Swim Resort',
    title: 'Amare Swim Resort - Luxury Swimwear and Resort Wear',
    description: 'Discover the perfect blend of style and comfort with Amare Swim Resort\'s luxury swimwear and resort wear collection.',
    images: [
      {
        url: 'https://amareswimwear.vercel.app/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Amare Swim Resort',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amare Swim Resort - Luxury Swimwear and Resort Wear',
    description: 'Discover the perfect blend of style and comfort with Amare Swim Resort\'s luxury swimwear and resort wear collection.',
    images: ['https://amareswimwear.vercel.app/images/twitter-image.jpg'],
    creator: '@AmareSwimsResort',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
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
            <ClientLayout>
              <div className="container mx-auto px-4 py-8">
                {children}
              </div>
              <Toaster />
            </ClientLayout>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}