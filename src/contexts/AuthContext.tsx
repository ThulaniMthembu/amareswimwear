'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  User, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload
} from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useRouter } from 'next/navigation'
import { toast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  sendVerificationEmail: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshUser = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser)
      setUser({ ...auth.currentUser })
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await refreshUser()
        if (!user.emailVerified) {
          await firebaseSignOut(auth)
          setUser(null)
          router.push('/auth')
          toast({
            title: "Email not verified",
            description: "Please verify your email before logging in.",
            variant: "destructive",
          })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await sendEmailVerification(userCredential.user)
      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account.",
      })
      router.push('/verify-email')
    } catch (error) {
      console.error('Error signing up:', error)
      toast({
        title: "Sign up failed",
        description: "An error occurred during sign up. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      if (!userCredential.user.emailVerified) {
        await firebaseSignOut(auth)
        toast({
          title: "Email not verified",
          description: "Please verify your email before logging in.",
          variant: "destructive",
        })
        router.push('/verify-email')
      } else {
        router.push('/profile')
      }
    } catch (error) {
      console.error('Error signing in:', error)
      toast({
        title: "Sign in failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      router.push('/')
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: "Sign out failed",
        description: "An error occurred during sign out. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const sendVerificationEmail = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser)
        toast({
          title: "Verification email sent",
          description: "Please check your inbox and follow the link to verify your email.",
        })
      } catch (error) {
        console.error('Error sending verification email:', error)
        toast({
          title: "Failed to send verification email",
          description: "An error occurred. Please try again later.",
          variant: "destructive",
        })
        throw error
      }
    } else {
      throw new Error('No user is currently signed in')
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
      toast({
        title: "Password reset email sent",
        description: "Please check your inbox for instructions to reset your password.",
      })
    } catch (error) {
      console.error('Error resetting password:', error)
      toast({
        title: "Failed to send password reset email",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      })
      throw error
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    sendVerificationEmail,
    resetPassword,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}