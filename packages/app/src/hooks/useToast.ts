'use client'

import { useCallback } from 'react'
import { toastManager } from '@/utils/toastManager'
import { ToastOptions } from 'react-toastify'

interface UseToastOptions extends ToastOptions {
  throttleKey?: string
  throttleMs?: number
}

export function useToast() {
  const showToast = useCallback((message: string, options?: UseToastOptions) => {
    return toastManager.show(message, options)
  }, [])
  
  const success = useCallback((message: string, options?: UseToastOptions) => {
    return toastManager.success(message, options)
  }, [])
  
  const error = useCallback((message: string, options?: UseToastOptions) => {
    return toastManager.error(message, options)
  }, [])
  
  const info = useCallback((message: string, options?: UseToastOptions) => {
    return toastManager.info(message, options)
  }, [])
  
  const warning = useCallback((message: string, options?: UseToastOptions) => {
    return toastManager.warning(message, options)
  }, [])
  
  return {
    toast: showToast,
    success,
    error,
    info,
    warning,
    clear: toastManager.clear
  }
}