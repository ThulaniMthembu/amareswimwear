import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafaff]">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-[#1c1c1c] mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-[#1c1c1c] mb-4">Page Not Found</h2>
          <p className="text-lg text-[#1c1c1c] mb-8">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Button asChild className="bg-[#1c1c1c] text-[#fafaff] hover:bg-[#e87167]">
            <Link href="/">Go Back Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}