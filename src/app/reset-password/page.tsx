'use client'

import React, { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      await sendPasswordResetEmail(auth, email)
      setMessage('Password reset email sent. Check your inbox.')
    } catch (err) {
      setError('Failed to send password reset email. Please try again.')
      console.error('Error sending password reset email:', err)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaff]">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#1c1c1c]">Reset Password</CardTitle>
            <CardDescription className="text-center text-[#4a4a4a]">Enter your email to reset your password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-[#1c1c1c]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white border-[#1c1c1c] text-[#1c1c1c]"
                />
              </div>
              <Button type="submit" className="w-full bg-[#1c1c1c] text-white hover:bg-[#e87167]">
                Reset Password
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            {message && <p className="text-green-500 text-sm text-center" role="alert">{message}</p>}
            {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

export default ResetPasswordPage