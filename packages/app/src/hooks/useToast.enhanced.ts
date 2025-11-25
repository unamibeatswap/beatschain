'use client'

import { useCallback, useRef } from 'react'
import { enhancedToastManager } from '@/utils/toastManager.enhanced'
import { performanceMonitor } from '@/utils/performanceMonitor'
import { ToastOptions } from 'react-toastify'

interface EnhancedToastOptions extends ToastOptions {
  throttleKey?: string
  throttleMs?: number
  once?: boolean // Show only once per component instance
}

export function useEnhancedToast() {
  const shownOnce = useRef(new Set<string>())
  
  const showToast = useCallback((message: string, options: EnhancedToastOptions = {}) => {
    const { once, throttleKey, throttleMs = 5000, ...restOptions } = options
    
    // Enhanced throttling with component-level deduplication
    const dedupeKey = `${throttleKey || message}_${Date.now()}`
    const throttleWindow = throttleMs
    
    // Handle "once" option with time-based expiry
    if (once) {
      const onceKey = throttleKey || message
      if (shownOnce.current.has(onceKey)) {
        return false
      }
      shownOnce.current.add(onceKey)
      
      // Auto-expire once keys after 30 seconds
      setTimeout(() => {
        shownOnce.current.delete(onceKey)
      }, 30000)
    }
    
    const result = enhancedToastManager.show(message, { 
      throttleKey: dedupeKey, 
      throttleMs: throttleWindow,
      ...restOptions 
    })
    
    // Track toast usage (simplified to avoid performance monitor dependency)
    if (typeof window !== 'undefined' && result) {
      console.debug('Toast shown:', message.slice(0, 50))
    }
    
    return result
  }, [])
  
  const success = useCallback((message: string, options: EnhancedToastOptions = {}) => {
    return showToast(message, { ...options, type: 'success' })
  }, [showToast])
  
  const error = useCallback((message: string, options: EnhancedToastOptions = {}) => {
    return showToast(message, { ...options, type: 'error' })
  }, [showToast])
  
  const info = useCallback((message: string, options: EnhancedToastOptions = {}) => {
    return showToast(message, { ...options, type: 'info' })
  }, [showToast])
  
  const warning = useCallback((message: string, options: EnhancedToastOptions = {}) => {
    return showToast(message, { ...options, type: 'warning' })
  }, [showToast])
  
  const dismiss = useCallback((key?: string) => {
    enhancedToastManager.dismiss(key)
  }, [])
  
  const clear = useCallback(() => {
    enhancedToastManager.clear()
    shownOnce.current.clear()
  }, [])
  
  // Cleanup on component unmount
  const cleanup = useCallback(() => {
    shownOnce.current.clear()
  }, [])
  
  return {
    toast: showToast,
    success,
    error,
    info,
    warning,
    dismiss,
    clear,
    cleanup
  }
}