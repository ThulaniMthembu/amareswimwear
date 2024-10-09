'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { applyActionCode, checkActionCode, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
import { auth, db } from '@/config/firebase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast, Toaster } from 'react-hot-toast'
import { doc, updateDoc } from 'firebase/firestore'

export default function EmailAction() {
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const mode = searchParams.get('mode')
    const oobCode = searchParams.get('oobCode')
    const continueUrl = searchParams.get('continueUrl')

    console.log('Mode:', mode)
    console.log('OOB Code:', oobCode)
    console.log('Continue URL:', continueUrl)

    if (!oobCode) {
      console.error('No OOB code provided')
      setMessage('Invalid action code. Please try again.')
      setIsLoading(false)
      return
    }

    const handleVerifyEmail = async () => {
      try {
        console.log('Starting email verification process')
        await applyActionCode(auth, oobCode)
        console.log('Email verification successful')
        const user = auth.currentUser
        if (user) {
          console.log('Current user:', user.uid)
          console.log('Updating user document in Firestore')
          await updateDoc(doc(db, 'users', user.uid), {
            emailVerified: true,
          })
          console.log('User document updated successfully')
        } else {
          console.log('No current user found')
        }
        setMessage('Email verified successfully. You can now sign in.')
        toast.success('Email verified successfully')
      } catch (error) {
        console.error('Error verifying email:', error)
        if (error instanceof Error) {
          console.error('Error name:', error.name)
          console.error('Error message:', error.message)
          console.error('Error stack:', error.stack)
        }
        setMessage('Failed to verify email. Please try again.')
        toast.error('Failed to verify email')
      }
      setIsLoading(false)
    }

    const handleResetPassword = async () => {
      try {
        console.log('Checking reset password code')
        await checkActionCode(auth, oobCode)
        console.log('Reset password code is valid')
        setMessage('You can now reset your password.')
      } catch (error) {
        console.error('Error checking reset password code:', error)
        if (error instanceof Error) {
          console.error('Error name:', error.name)
          console.error('Error message:', error.message)
          console.error('Error stack:', error.stack)
        }
        setMessage('Invalid or expired action code. Please try again.')
        toast.error('Invalid or expired action code')
      }
      setIsLoading(false)
    }

    switch (mode) {
      case 'verifyEmail':
        handleVerifyEmail()
        break
      case 'resetPassword':
        handleResetPassword()
        break
      default:
        console.error('Invalid mode:', mode)
        setMessage('Invalid mode. Please try again.')
        setIsLoading(false)
        toast.error('Invalid mode')
    }
  }, [searchParams])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.')
      setIsLoading(false)
      return
    }

    const oobCode = searchParams.get('oobCode')
    if (!oobCode) {
      toast.error('Invalid action code. Please try again.')
      setIsLoading(false)
      return
    }

    try {
      console.log('Verifying password reset code')
      await verifyPasswordResetCode(auth, oobCode)
      console.log('Password reset code verified')
      console.log('Confirming password reset')
      await confirmPasswordReset(auth, oobCode, newPassword)
      console.log('Password reset confirmed')
      toast.success('Password reset successfully. You can now sign in with your new password.')
      router.push('/auth')
    } catch (error) {
      console.error('Error resetting password:', error)
      if (error instanceof Error) {
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      toast.error('Failed to reset password. Please try again.')
    }
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen bg-white">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-black">Email Action</CardTitle>
          <CardDescription className="text-center text-black">{message}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center">Processing...</p>
          ) : searchParams.get('mode') === 'resetPassword' ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">Reset Password</Button>
            </form>
          ) : null}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push('/auth')} className="bg-black text-white hover:bg-gray-800">
            Go to Sign In
          </Button>
        </CardFooter>
      </Card>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  )
}