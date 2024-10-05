'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, AuthError } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { createUserProfile } from '@/utils/user'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FcGoogle } from 'react-icons/fc'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter'
import toast, { Toaster } from 'react-hot-toast'
import ReCAPTCHA from "react-google-recaptcha"
import { Eye, EyeOff } from 'lucide-react'

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const router = useRouter()
  const { user, loading } = useAuth()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (user && !loading) {
      const redirect = searchParams.get('redirect')
      if (redirect) {
        router.push(`/${redirect}`)
      } else {
        router.push('/profile')
      }
    }
  }, [user, loading, router, searchParams])

  const validatePassword = (password: string) => {
    const minLength = 8
    const maxLength = 16
    const hasUpperCase = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (password.length < minLength || password.length > maxLength) {
      return 'Password must be between 8 and 16 characters long.'
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter.'
    }
    if (!hasNumber) {
      return 'Password must contain at least one number.'
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character.'
    }
    return null
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage('')
    setIsLoading(true)

    if (!recaptchaValue) {
      toast.error('Please complete the reCAPTCHA verification.')
      setIsLoading(false)
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      toast.error(passwordError)
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      setIsLoading(false)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await sendEmailVerification(userCredential.user)
      await createUserProfile(userCredential.user)
      setSuccessMessage('Account created successfully. Please check your email for verification.')
      const redirect = searchParams.get('redirect')
      if (redirect) {
        router.push(`/${redirect}`)
      } else {
        router.push('/profile')
      }
    } catch (error) {
      const authError = error as AuthError
      toast.error(authError.message || 'Failed to create an account. Please try again.')
      console.error(error)
    } finally {
      setIsLoading(false)
      recaptchaRef.current?.reset()
      setRecaptchaValue(null)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage('')
    setIsLoading(true)

    if (!recaptchaValue) {
      toast.error('Please complete the reCAPTCHA verification.')
      setIsLoading(false)
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      const redirect = searchParams.get('redirect')
      if (redirect) {
        router.push(`/${redirect}`)
      } else {
        router.push('/profile')
      }
    } catch (error) {
      const authError = error as AuthError
      toast.error(authError.message || 'Failed to sign in. Please check your credentials.')
      console.error(error)
    } finally {
      setIsLoading(false)
      recaptchaRef.current?.reset()
      setRecaptchaValue(null)
    }
  }

  const handleGoogleSignIn = async () => {
    setSuccessMessage('')
    setIsLoading(true)
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      await createUserProfile(result.user)
      const redirect = searchParams.get('redirect')
      if (redirect) {
        router.push(`/${redirect}`)
      } else {
        router.push('/profile')
      }
    } catch (error) {
      const authError = error as AuthError
      toast.error(authError.message || 'Failed to sign in with Google. Please try again.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fafaff]">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-xl text-[#1c1c1c]">Loading...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaff]">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md auth-form">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#1c1c1c]">Welcome to Amare Swimwear</CardTitle>
            <CardDescription className="text-center text-[#4a4a4a]">Sign in or create an account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signin" className="auth-tab">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="auth-tab">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div className="inputForm">
                    <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg">
                      <g id="Layer_3" data-name="Layer 3">
                        <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
                      </g>
                    </svg>
                    <Input
                      type="email"
                      placeholder="Enter your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="input"
                    />
                  </div>
                  <div className="inputForm relative">
                    <svg height="20" viewBox="-64 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                      <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
                    </svg>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="input pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 absolute right-0 top-1/2 transform -translate-y-1/2 text-black"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  <div className="flex-row">
                    <div className="flex items-center">
                      <input type="checkbox" id="remember-me" className="mr-2" />
                      <Label htmlFor="remember-me" className="text-black">Remember me</Label>
                    </div>
                    <Link href="/reset-password" className="span">Forgot password?</Link>
                  </div>
                  <ReCAPTCHA
  ref={recaptchaRef}
  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
  onChange={(value: string | null) => {
    console.log("reCAPTCHA value:", value);
    setRecaptchaValue(value);
  }}
/>
                  <Button type="submit" className="button-submit" disabled={isLoading || !recaptchaValue}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div className="inputForm">
                    <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg">
                      <g id="Layer_3" data-name="Layer 3">
                        <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
                      </g>
                    </svg>
                    <Input
                      type="email"
                      placeholder="Enter your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="input"
                    />
                  </div>
                  <div className="inputForm relative">
                    <svg height="20" viewBox="-64 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                      <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
                    </svg>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setShowPasswordRequirements(true)}
                      onBlur={() => setShowPasswordRequirements(false)}
                      required
                      className="input pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 absolute right-0 top-1/2 transform -translate-y-1/2 text-black"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  {showPasswordRequirements && (
                    <p className="text-sm text-gray-600">
                      Password must be 8-16 characters long, contain at least one uppercase letter, one number, and one special character.
                    </p>
                  )}
                  <div className="inputForm relative">
                    <svg height="20" viewBox="-64 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                      <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
                    </svg>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="input pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 absolute right-0 top-1/2 transform -translate-y-1/2 text-black"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">
                        {showConfirmPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  <PasswordStrengthMeter password={password} />
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                    onChange={(value: string | null) => setRecaptchaValue(value)}
                  />
                  <Button type="submit" className="button-submit" disabled={isLoading || !recaptchaValue}>
                    {isLoading ? 'Signing Up...' : 'Sign Up'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            {successMessage && <p className="text-green-500 text-sm mt-2" role="alert">{successMessage}</p>}
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <p className="p line">Or With</p>
            <Button 
              onClick={handleGoogleSignIn} 
              variant="outline" 
              className="w-full h-10 px-4 py-2 border border-gray-300 rounded-md text-black bg-white hover:bg-[#4285F4] hover:text-white transition-colors duration-300 flex items-center justify-center"
              disabled={isLoading}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  )
}

export default AuthPage