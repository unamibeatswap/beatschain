'use client'

import { toast, ToastOptions } from 'react-toastify'

class ToastManager {
  private activeToasts = new Map<string, number>()
  private throttleMap = new Map<string, number>()
  
  private generateId(message: string, type: string = 'default'): string {
    return `${type}-${btoa(message).slice(0, 8)}-${Date.now()}`
  }
  
  private shouldThrottle(key: string, throttleMs: number = 3000): boolean {
    const lastShown = this.throttleMap.get(key)
    const now = Date.now()
    
    if (!lastShown || now - lastShown > throttleMs) {
      this.throttleMap.set(key, now)
      return false
    }
    return true
  }
  
  show(message: string, options: ToastOptions & { 
    throttleKey?: string
    throttleMs?: number 
  } = {}) {
    const { throttleKey, throttleMs = 3000, ...toastOptions } = options
    
    // Throttle check
    if (throttleKey && this.shouldThrottle(throttleKey, throttleMs)) {
      return
    }
    
    // Generate unique ID if not provided
    const toastId = toastOptions.toastId || this.generateId(message, toastOptions.type || 'default')
    
    // Prevent duplicate active toasts
    if (this.activeToasts.has(toastId)) {
      return
    }
    
    this.activeToasts.set(toastId, Date.now())
    
    const finalOptions: ToastOptions = {
      ...toastOptions,
      toastId,
      onClose: () => {
        this.activeToasts.delete(toastId)
        toastOptions.onClose?.()
      }
    }
    
    return toast(message, finalOptions)
  }
  
  success(message: string, options?: ToastOptions & { throttleKey?: string }) {
    return this.show(message, { ...options, type: 'success' })
  }
  
  error(message: string, options?: ToastOptions & { throttleKey?: string }) {
    return this.show(message, { ...options, type: 'error' })
  }
  
  info(message: string, options?: ToastOptions & { throttleKey?: string }) {
    return this.show(message, { ...options, type: 'info' })
  }
  
  warning(message: string, options?: ToastOptions & { throttleKey?: string }) {
    return this.show(message, { ...options, type: 'warning' })
  }
  
  clear() {
    this.activeToasts.clear()
    this.throttleMap.clear()
    toast.dismiss()
  }
}

export const toastManager = new ToastManager()