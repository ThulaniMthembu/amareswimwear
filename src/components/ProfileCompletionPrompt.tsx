'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X } from 'lucide-react'

export default function ProfileCompletionPrompt() {
  const { user } = useAuth()
  const router = useRouter()
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          let completionPercentage = 0
          const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'province', 'postalCode']
          fields.forEach(field => {
            if (userData[field]) completionPercentage += 12.5
          })
          setProfileCompletion(Math.round(completionPercentage))
          setShowPrompt(completionPercentage < 100)
        } else {
          setShowPrompt(true)
        }
      }
    }

    checkProfileCompletion()
  }, [user])

  const handleCompleteProfile = () => {
    router.push('/profile')
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <Alert className="mb-4 bg-[#1c1c1c] text-white">
      <AlertTitle className="text-lg font-semibold mb-2">Complete Your Profile</AlertTitle>
      <AlertDescription>
        <div className="mb-2">
          Your profile is {profileCompletion}% complete. Finish setting up your profile to get the most out of Amare Swim Resort.
        </div>
        <Progress value={profileCompletion} className="mb-4" />
        <div className="flex justify-between items-center">
          <Button onClick={handleCompleteProfile} className="bg-[#e87167] text-white hover:bg-[#d35f56]">
            Complete Profile
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDismiss} className="text-white hover:text-[#e87167]">
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}