'use client'

interface NotificationEntry {
  message: string
  type: string
  timestamp: number
  count: number
}

class NotificationDeduplicator {
  private notifications = new Map<string, NotificationEntry>()
  private readonly CLEANUP_INTERVAL = 60000 // 1 minute
  private readonly EXPIRY_TIME = 300000 // 5 minutes
  
  constructor() {
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL)
  }
  
  private cleanup() {
    const now = Date.now()
    const expiredKeys: string[] = []
    
    this.notifications.forEach((entry, key) => {
      if (now - entry.timestamp > this.EXPIRY_TIME) {
        expiredKeys.push(key)
      }
    })
    
    expiredKeys.forEach(key => this.notifications.delete(key))
  }
  
  private generateKey(message: string, type: string): string {
    return `${type}:${message.toLowerCase().replace(/[^a-z0-9]/g, '')}`
  }
  
  shouldShow(message: string, type: string = 'default', throttleMs: number = 3000): boolean {
    const key = this.generateKey(message, type)
    const now = Date.now()
    const existing = this.notifications.get(key)
    
    if (!existing) {
      this.notifications.set(key, {
        message,
        type,
        timestamp: now,
        count: 1
      })
      return true
    }
    
    // Check if enough time has passed
    if (now - existing.timestamp > throttleMs) {
      existing.timestamp = now
      existing.count++
      return true
    }
    
    // Update count but don't show
    existing.count++
    return false
  }
  
  getStats() {
    return {
      totalNotifications: this.notifications.size,
      notifications: Array.from(this.notifications.entries()).map(([key, entry]) => ({
        key,
        ...entry
      }))
    }
  }
  
  clear() {
    this.notifications.clear()
  }
}

export const notificationDeduplicator = new NotificationDeduplicator()