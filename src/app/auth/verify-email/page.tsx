'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { sendEmailVerification } from 'firebase/auth'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast, Toaster } from "react-hot-toast"

export default function VerifyEmail() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [resendDisabled, setResendDisabled] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  const handleResendVerification = async () => {
    if (resendDisabled || !user) return

    try {
      await sendEmailVerification(user, {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?uid=${user.uid}`,
        handleCodeInApp: true,
      })
      setResendDisabled(true)
      toast.success('Verification email sent. Please check your inbox.')
      setTimeout(() => setResendDisabled(false), 60000) // Enable resend after 1 minute
    } catch (error) {
      console.error('Error sending verification email:', error)
      toast.error('Failed to send verification email. Please try again.')
    }
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-xl text-black">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
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
            Please check your email and click the link to verify your account. You can close this page now.
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
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  )
}