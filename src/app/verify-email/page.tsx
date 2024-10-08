'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import toast from 'react-hot-toast'

export default function VerifyEmail() {
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setIsVerified(true)
        router.push('/profile')
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleResendVerification = async () => {
    const user = auth.currentUser
    if (user) {
      try {
        await sendEmailVerification(user)
        toast.success('Verification email sent. Please check your inbox.')
      } catch (error) {
        console.error('Error sending verification email:', error)
        toast.error('Error sending verification email. Please try again.')
      }
    }
  }

  if (isVerified) {
    return null // This will be replaced by the router.push to /profile
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaff]">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#1c1c1c]">Verify Your Email</CardTitle>
            <CardDescription className="text-center text-black">
              We&apos;ve sent a verification email to your inbox. Please click the link in the email to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-[#4a4a4a]">
              If you haven&apos;t received the email, please check your spam folder or click the button below to resend the verification email.
            </p>
            <Button onClick={handleResendVerification} className="bg-[#1c1c1c] text-white hover:bg-[#e87167]">
              Resend Verification Email
            </Button>
          </CardContent>
          <CardFooter className="text-center text-sm text-[#4a4a4a]">
            <p>Once you&apos;ve verified your email, you&apos;ll be automatically redirected to your profile page.</p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}