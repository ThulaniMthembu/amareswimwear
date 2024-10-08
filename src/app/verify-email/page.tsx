'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { toast } from "@/components/ui/use-toast"

export default function VerifyEmail() {
  const { user, loading, sendVerificationEmail } = useAuth()
  const router = useRouter()
  const [resendDisabled, setResendDisabled] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth')
      } else if (user.emailVerified) {
        router.push('/profile')
      }
    }
  }, [user, loading, router])

  const handleResendVerification = async () => {
    if (resendDisabled) return

    try {
      await sendVerificationEmail()
      setResendDisabled(true)
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox for the verification link.",
      })
      setTimeout(() => setResendDisabled(false), 60000) // Enable resend after 1 minute
    } catch (error) {
      console.error('Error sending verification email:', error)
      toast({
        title: "Error",
        description: "Failed to send verification email. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fafaff]">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-xl text-black">Loading...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null // This will be handled by the useEffect hook
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaff]">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-black">Verify Your Email</CardTitle>
            <CardDescription className="text-center text-black">
              We&apos;ve sent a verification email to your inbox. Please click the link in the email to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-black">
              If you haven&apos;t received the email, please check your spam folder or click the button below to resend the
              verification email.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={handleResendVerification} 
              disabled={resendDisabled}
              className="bg-black text-white hover:bg-gray-800"
            >
              Resend Verification Email
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}