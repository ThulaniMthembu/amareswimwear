'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { applyActionCode } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { toast } from "@/components/ui/use-toast"

export default function AuthAction() {
  const router = useRouter()

  useEffect(() => {
    const handleVerification = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const mode = urlParams.get('mode')
      const actionCode = urlParams.get('oobCode')

      if (mode === 'verifyEmail' && actionCode) {
        try {
          await applyActionCode(auth, actionCode)
          toast({
            title: "Email Verified",
            description: "Your email has been successfully verified.",
          })
          router.push('/profile')
        } catch (error) {
          console.error('Error verifying email:', error)
          toast({
            title: "Verification Failed",
            description: "There was an error verifying your email. Please try again.",
            variant: "destructive",
          })
          router.push('/verify-email')
        }
      } else {
        router.push('/')
      }
    }

    handleVerification()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fafaff]">
      <p className="text-xl text-black">Verifying your email...</p>
    </div>
  )
}