'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { toastManager } from '@/utils/toastManager'

interface Notification {
  id: string
  type: 'purchase' | 'royalty' | 'upload' | 'system'
  title: string
  message: string
  timestamp: number
  read: boolean
  metadata?: any
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('beatschain_notifications')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setNotifications(parsed)
      } catch (error) {
        console.warn('Failed to parse stored notifications:', error)
      }
    }
  }, [])
  
  // Save notifications to localStorage when they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('beatschain_notifications', JSON.stringify(notifications.slice(0, 50))) // Keep only last 50
    }
  }, [notifications])
  
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${notification.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false
    }
    
    setNotifications(prev => {
      // Prevent duplicate notifications within 5 seconds
      const recentSimilar = prev.find(n => 
        n.type === notification.type && 
        n.message === notification.message && 
        Date.now() - n.timestamp < 5000
      )
      
      if (recentSimilar) return prev
      
      return [newNotification, ...prev].slice(0, 50) // Keep only last 50
    })
    
    // Show toast notification with throttling
    toastManager.info(notification.message, {
      throttleKey: `${notification.type}-${notification.message}`,
      throttleMs: 10000 // 10 second throttle for similar notifications
    })
  }, [])
  
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }, [])
  
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])
  
  const clearNotifications = useCallback(() => {
    setNotifications([])
    localStorage.removeItem('beatschain_notifications')
  }, [])
  
  const unreadCount = notifications.filter(n => !n.read).length
  
  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}