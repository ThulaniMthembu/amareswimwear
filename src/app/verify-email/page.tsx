'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import ClientLayout from '../ClientLayout'

export default function VerifyEmail() {
  const { user, loading, sendVerificationEmail, refreshUser } = useAuth()
  const router = useRouter()
  const [resendDisabled, setResendDisabled] = useState(false)

  useEffect(() => {
    const checkVerification = async () => {
      if (!loading) {
        if (!user) {
          router.push('/auth')
        } else {
          await refreshUser()
          if (user.emailVerified) {
            router.push('/profile')
          }
        }
      }
    }

    checkVerification()
  }, [user, loading, router, refreshUser])

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

  if (loading || !user) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-screen bg-white">
          <p className="text-xl text-black">Loading...</p>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen bg-white">
        <Card className="w-full max-w-md bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-black">Verify Your Email</CardTitle>
            <CardDescription className="text-center text-black">
              We&apos;ve sent a verification email to:
            </CardDescription>
            <p className="text-center font-medium text-black">{user.email}</p>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-black">
              Please click the link in the email to verify your account. If you haven&apos;t received the email, please check your spam folder or click the button below to resend the verification email.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={handleResendVerification} 
              disabled={resendDisabled}
              className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
            >
              Resend Verification Email
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ClientLayout>
  )
}