'use client'

import { toast, ToastOptions, Id } from 'react-toastify'

interface ToastState {
  id: Id
  timestamp: number
  key: string
}

class EnhancedToastManager {
  private activeToasts = new Map<string, ToastState>()
  private throttleMap = new Map<string, number>()
  private readonly CLEANUP_INTERVAL = 30000 // 30 seconds
  private readonly MAX_ACTIVE_TOASTS = 5
  
  constructor() {
    // Cleanup expired toasts periodically
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL)
  }
  
  private cleanup() {
    const now = Date.now()
    const expiredKeys: string[] = []
    
    this.activeToasts.forEach((state, key) => {
      if (now - state.timestamp > 10000) { // 10 second expiry
        expiredKeys.push(key)
      }
    })
    
    expiredKeys.forEach(key => {
      this.activeToasts.delete(key)
      this.throttleMap.delete(key)
    })
  }
  
  private generateKey(message: string, type: string = 'default'): string {
    return `${type}:${btoa(message.slice(0, 50)).slice(0, 12)}`
  }
  
  private shouldThrottle(key: string, throttleMs: number): boolean {
    const lastShown = this.throttleMap.get(key)
    const now = Date.now()
    
    if (!lastShown || now - lastShown > throttleMs) {
      this.throttleMap.set(key, now)
      return false
    }
    return true
  }
  
  private enforceLimit() {
    if (this.activeToasts.size >= this.MAX_ACTIVE_TOASTS) {
      // Remove oldest toast
      const oldest = Array.from(this.activeToasts.entries())
        .sort(([,a], [,b]) => a.timestamp - b.timestamp)[0]
      
      if (oldest) {
        toast.dismiss(oldest[1].id)
        this.activeToasts.delete(oldest[0])
      }
    }
  }
  
  show(message: string, options: ToastOptions & { 
    throttleKey?: string
    throttleMs?: number 
  } = {}): Id | undefined {
    const { throttleKey, throttleMs = 3000, ...toastOptions } = options
    const key = throttleKey || this.generateKey(message, toastOptions.type || 'default')
    
    // Check throttling
    if (this.shouldThrottle(key, throttleMs)) {
      return
    }
    
    // Check if already active
    if (this.activeToasts.has(key)) {
      return this.activeToasts.get(key)?.id
    }
    
    // Enforce toast limit
    this.enforceLimit()
    
    const toastId = toastOptions.toastId || `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const id = toast(message, {
      ...toastOptions,
      toastId,
      onClose: () => {
        this.activeToasts.delete(key)
        toastOptions.onClose?.()
      }
    })
    
    this.activeToasts.set(key, {
      id,
      timestamp: Date.now(),
      key
    })
    
    return id
  }
  
  success(message: string, options?: ToastOptions & { throttleKey?: string; throttleMs?: number }) {
    return this.show(message, { ...options, type: 'success' })
  }
  
  error(message: string, options?: ToastOptions & { throttleKey?: string; throttleMs?: number }) {
    return this.show(message, { ...options, type: 'error' })
  }
  
  info(message: string, options?: ToastOptions & { throttleKey?: string; throttleMs?: number }) {
    return this.show(message, { ...options, type: 'info' })
  }
  
  warning(message: string, options?: ToastOptions & { throttleKey?: string; throttleMs?: number }) {
    return this.show(message, { ...options, type: 'warning' })
  }
  
  dismiss(key?: string) {
    if (key && this.activeToasts.has(key)) {
      const state = this.activeToasts.get(key)
      if (state) {
        toast.dismiss(state.id)
        this.activeToasts.delete(key)
      }
    } else {
      toast.dismiss()
      this.activeToasts.clear()
    }
  }
  
  clear() {
    this.activeToasts.clear()
    this.throttleMap.clear()
    toast.dismiss()
  }
}

export const enhancedToastManager = new EnhancedToastManager()