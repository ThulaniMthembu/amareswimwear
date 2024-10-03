import React from 'react'
import { Loader2 } from 'lucide-react'

export function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="bg-gray-200 rounded-lg p-6 flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
        <span className="text-lg font-medium text-black">Loading...</span>
      </div>
    </div>
  )
}