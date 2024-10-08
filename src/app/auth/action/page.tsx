'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { applyActionCode } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { toast } from "@/components/ui/use-toast"
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ClientLayout from '../../ClientLayout'

export default function AuthAction() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying')

  useEffect(() => {
    const handleVerification = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const mode = urlParams.get('mode')
      const actionCode = urlParams.get('oobCode')

      if (mode === 'verifyEmail' && actionCode) {
        try {
          await applyActionCode(auth, actionCode)
          await refreshUser()
          setVerificationStatus('success')
          toast({
            title: "Email Verified",
            description: "Your email has been successfully verified.",
          })
        } catch (error) {
          console.error('Error verifying email:', error)
          setVerificationStatus('error')
          toast({
            title: "Verification Failed",
            description: "There was an error verifying your email. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        router.push('/')
      }
    }

    handleVerification()
  }, [router, refreshUser])

  const handleContinue = () => {
    const origin = window.location.origin
    router.push(`${origin}/profile`)
  }

  return (
    <ClientLayout>
      <div className="flex items-center justify-center min-h-screen w-full bg-white px-4">
        <Card className="w-full max-w-md bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-black">
              {verificationStatus === 'verifying' && 'Verifying Your Email...'}
              {verificationStatus === 'success' && 'Email Verified'}
              {verificationStatus === 'error' && 'Verification Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {verificationStatus === 'verifying' && (
              <p className="text-center text-black">Please wait while we verify your email address.</p>
            )}
            {verificationStatus === 'success' && (
              <>
                <p className="text-center mb-4 text-black">Your email has been successfully verified. You can now access all features of your account.</p>
                <Button onClick={handleContinue} className="w-full bg-black text-white hover:bg-gray-800">
                  Continue to Profile
                </Button>
              </>
            )}
            {verificationStatus === 'error' && (
              <>
                <p className="text-center mb-4 text-black">There was an error verifying your email. Please try again or contact support if the problem persists.</p>
                <Button onClick={() => router.push('/verify-email')} className="w-full bg-black text-white hover:bg-gray-800">
                  Back to Verification Page
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  )
}