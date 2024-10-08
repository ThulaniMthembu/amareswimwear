'use client'

import React, { useState, useEffect } from 'react'
import { Loader } from '@/components/Loader'
import { Suspense } from 'react'

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
      {isLoading ? (
        <Loader aria-label="Loading content" />
      ) : (
        <Suspense fallback={<Loader aria-label="Loading content" />}>
          {children}
        </Suspense>
      )}
    </>
  )
}