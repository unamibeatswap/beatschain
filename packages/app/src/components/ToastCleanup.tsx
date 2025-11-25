'use client'

import { useEffect } from 'react'
import { useEnhancedToast } from '@/hooks/useToast.enhanced'

export function ToastCleanup() {
  const { clear } = useEnhancedToast()
  
  useEffect(() => {
    // Clear toasts on route changes
    const handleRouteChange = () => {
      clear()
    }
    
    // Listen for navigation events
    window.addEventListener('beforeunload', handleRouteChange)
    
    return () => {
      window.removeEventListener('beforeunload', handleRouteChange)
    }
  }, [clear])
  
  return null
}