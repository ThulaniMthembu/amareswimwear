"use client"

import React from 'react'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface LoaderProps {
  'aria-label'?: string
}

export function Loader({ 'aria-label': ariaLabel = 'Loading content' }: LoaderProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      aria-label={ariaLabel}
    >
      <motion.div 
        className="bg-secondary rounded-lg p-6 flex flex-col items-center space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-lg font-medium text-foreground">Loading...</span>
      </motion.div>
    </div>
  )
}