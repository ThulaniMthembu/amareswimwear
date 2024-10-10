'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import CartModal from './CartModal'
import { Button } from "@/components/ui/button"
import { ShoppingBag, User, Menu, LogOut, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { auth } from '@/config/firebase'
import { signOut } from 'firebase/auth'
import { motion, AnimatePresence } from 'framer-motion'
import { lockScroll, unlockScroll } from '@/utils/scrollLock'

const featuredItems = [
  { name: 'New Arrivals', href: '/shop' },
  { name: 'Best Sellers', href: '/shop' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cart } = useCart()
  const [cartItemCount, setCartItemCount] = useState(0)
  const { user } = useAuth()
  const menuRef = useRef<HTMLDivElement>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    setCartItemCount(cart.reduce((total, item) => total + item.quantity, 0))
  }, [cart])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      lockScroll()
    } else {
      unlockScroll()
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      unlockScroll()
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Delay for animation
      await signOut(auth)
    } catch (error) {
      console.error('Failed to sign out', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <nav className="bg-[#fafaff] text-[#1c1c1c] p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Amare
        </Link>
        <div className="hidden md:flex items-center">
          <Link href="/" className="hover:text-[#e87167] ml-4">Home</Link>
          <Link href="/shop" className="hover:text-[#e87167] ml-4">Shop</Link>
          <Link href="/#about" className="hover:text-[#e87167] ml-4">About</Link>
          <Link href="/contact" className="hover:text-[#e87167] ml-4">Contact</Link>
          <Link href="/blog" className="hover:text-[#e87167] ml-4">Blog</Link>
          <div className="h-6 w-px bg-gray-300 mx-4"></div>
          {featuredItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hover:text-[#e87167] ml-4"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center">
          {user ? (
            <motion.div 
              className="flex items-center ml-4"
              initial={{ opacity: 1 }}
              animate={{ opacity: isSigningOut ? 0 : 1 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/profile" className="text-sm font-medium hover:text-[#e87167] mr-2">
                {user.displayName ? `${user.displayName.split(' ')[0].charAt(0)}${user.displayName.split(' ')[1]?.charAt(0) || ''}` : 'U'}
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                <LogOut className={`h-5 w-5 ${isSigningOut ? 'animate-spin' : ''}`} />
                <span className="sr-only">Sign out</span>
              </Button>
            </motion.div>
          ) : (
            <Link href="/auth" className="ml-4">
              <Button variant="ghost" size="icon">
                <User className="h-6 w-6" />
                <span className="sr-only">User account</span>
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggleCart} className="relative ml-4">
            <ShoppingBag className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemCount}
              </span>
            )}
            <span className="sr-only">Shopping cart</span>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden ml-4" onClick={toggleMenu} aria-label="Toggle menu">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 w-full sm:w-1/2 h-full bg-[#fafaff] shadow-lg z-50 overflow-y-auto"
          >
            <div className="flex flex-col h-full p-4">
              <div className="flex justify-end">
                <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Close menu">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/" className="text-lg hover:text-[#e87167]" onClick={toggleMenu}>Home</Link>
                <Link href="/shop" className="text-lg hover:text-[#e87167]" onClick={toggleMenu}>Shop</Link>
                <Link href="/#about" className="text-lg hover:text-[#e87167]" onClick={toggleMenu}>About</Link>
                <Link href="/contact" className="text-lg hover:text-[#e87167]" onClick={toggleMenu}>Contact</Link>
                <Link href="/blog" className="text-lg hover:text-[#e87167]" onClick={toggleMenu}>Blog</Link>
                <div className="h-px bg-gray-300 my-2"></div>
                {featuredItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg hover:text-[#e87167]"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                ))}
                {user ? (
                  <motion.div 
                    className="flex items-center justify-between"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isSigningOut ? 0 : 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Link href="/profile" className="text-lg hover:text-[#e87167]" onClick={toggleMenu}>
                      {user.displayName ? `${user.displayName.split(' ')[0].charAt(0)}${user.displayName.split(' ')[1]?.charAt(0) || ''}` : 'U'}
                    </Link>
                    <Button 
                      variant="ghost" 
                      onClick={handleSignOut} 
                      className="p-0 hover:text-[#e87167]"
                      disabled={isSigningOut}
                    >
                      <LogOut className={`h-6 w-6 ${isSigningOut ? 'animate-spin' : ''}`} />
                      <span className="sr-only">Sign out</span>
                    </Button>
                  </motion.div>
                ) : (
                  <Link href="/auth" onClick={toggleMenu}>
                    <Button variant="ghost" className="justify-start p-0 hover:text-[#e87167]">
                      <User className="h-6 w-6 mr-2" />
                      Sign in
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CartModal isOpen={isCartOpen} onClose={toggleCart} />
    </nav>
  )
}