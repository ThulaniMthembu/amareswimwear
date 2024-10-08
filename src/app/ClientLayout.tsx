'use client'

import React, { useState, useEffect } from 'react'
import { Loader } from '@/components/Loader'
import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Adjust this value to control how long the loader is shown

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader aria-label="Loading content" />
          </div>
        ) : (
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <Loader aria-label="Loading content" />
            </div>
          }>
            {children}
          </Suspense>
        )}
      </main>
      <Footer />
    </>
  )
}