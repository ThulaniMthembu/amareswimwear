'use client'

import React, { useState, useEffect } from 'react'
import { Loader } from '@/components/Loader'
import { Suspense } from 'react'

export default function ClientLayout({
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
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Suspense fallback={<Loader />}>
          {children}
        </Suspense>
      )}
    </>
  )
}