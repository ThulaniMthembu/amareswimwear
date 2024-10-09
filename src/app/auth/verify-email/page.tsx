'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { applyActionCode, sendEmailVerification } from 'firebase/auth'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast, Toaster } from "react-hot-toast"
import ClientLayout from '../../ClientLayout'

export default function VerifyEmail() {
  const { user, loading, refreshUser } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [resendDisabled, setResendDisabled] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error' | 'waiting'>('waiting')

  useEffect(() => {
    const verifyEmail = async () => {
      const oobCode = searchParams.get('oobCode')
      const uid = searchParams.get('uid')

      if (oobCode && uid) {
        setVerificationStatus('pending')
        try {
          await applyActionCode(auth, oobCode)
          const pendingUserData = localStorage.getItem('pendingUserData')
          if (pendingUserData) {
            const userData = JSON.parse(pendingUserData)
            await setDoc(doc(db, 'users', uid), {
              ...userData,
              emailVerified: true,
            })
            localStorage.removeItem('pendingUserData')
          } else {
            await updateDoc(doc(db, 'users', uid), {
              emailVerified: true,
            })
          }
          setVerificationStatus('success')
          toast.success('Email verified successfully')
        } catch (error) {
          console.error('Error verifying email:', error)
          setVerificationStatus('error')
          toast.error('Failed to verify email. Please try again.')
        }
      }
    }

    verifyEmail()
  }, [searchParams])

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
              {verificationStatus === 'waiting' && "We've sent a verification email to:"}
              {verificationStatus === 'pending' && "Verifying your email..."}
              {verificationStatus === 'success' && "Your email has been verified!"}
              {verificationStatus === 'error' && "There was an error verifying your email."}
            </CardDescription>
            {verificationStatus === 'waiting' && <p className="text-center font-medium text-black">{user.email}</p>}
          </CardHeader>
          <CardContent className="text-center">
            {verificationStatus === 'waiting' && (
              <p className="mb-4 text-black">
                Please click the link in the email to verify your account. If you haven&apos;t received the email, please check your spam folder or click the button below to resend the verification email.
              </p>
            )}
            {verificationStatus === 'success' && (
              <p className="text-center text-green-600">You can now access your account.</p>
            )}
            {verificationStatus === 'error' && (
              <p className="text-center text-red-600">Please try clicking the link in your email again or request a new verification email.</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {verificationStatus === 'waiting' && (
              <Button 
                onClick={handleResendVerification} 
                disabled={resendDisabled}
                className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
              >
                Resend Verification Email
              </Button>
            )}
            {verificationStatus === 'success' && (
              <Button onClick={() => router.push('/profile')} className="bg-black text-white hover:bg-gray-800">
                Go to Profile
              </Button>
            )}
            {verificationStatus === 'error' && (
              <Button onClick={handleResendVerification} className="bg-black text-white hover:bg-gray-800">
                Resend Verification Email
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </ClientLayout>
  )
}