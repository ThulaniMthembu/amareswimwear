'use client'

import { CartProvider } from '@/contexts/CartContext'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}