export interface UserInteraction {
  userId: string
  beatId?: string
  type: 'view' | 'play' | 'like' | 'share' | 'purchase' | 'search' | 'filter'
  source: 'browse' | 'search' | 'recommendation' | 'social' | 'direct'
  timestamp: number
  metadata?: Record<string, any>
}

export function trackUserBehavior(interaction: Omit<UserInteraction, 'timestamp'>) {
  if (typeof window === 'undefined') return

  try {
    const fullInteraction: UserInteraction = {
      ...interaction,
      timestamp: Date.now()
    }

    // Store in localStorage for analytics
    const key = `interactions_${interaction.userId}`
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    existing.push(fullInteraction)
    
    // Keep only last 1000 interactions per user
    if (existing.length > 1000) {
      existing.splice(0, existing.length - 1000)
    }
    
    localStorage.setItem(key, JSON.stringify(existing))

    // Update user behavior summary
    const behaviorKey = `user_behavior_${interaction.userId}`
    const behavior = JSON.parse(localStorage.getItem(behaviorKey) || '{}')
    
    behavior.lastActivity = Date.now()
    behavior.totalInteractions = (behavior.totalInteractions || 0) + 1
    behavior[interaction.type] = (behavior[interaction.type] || 0) + 1
    
    localStorage.setItem(behaviorKey, JSON.stringify(behavior))
  } catch (error) {
    console.error('Failed to track user behavior:', error)
  }
}

export function getUserBehaviorSummary(userId: string) {
  if (typeof window === 'undefined') return null

  try {
    const interactions = JSON.parse(localStorage.getItem(`interactions_${userId}`) || '[]')
    const behavior = JSON.parse(localStorage.getItem(`user_behavior_${userId}`) || '{}')
    
    return {
      totalInteractions: interactions.length,
      recentInteractions: interactions.slice(-10),
      behaviorSummary: behavior,
      sessionTime: behavior.lastActivity ? Date.now() - behavior.lastActivity : 0
    }
  } catch (error) {
    console.error('Failed to get user behavior summary:', error)
    return null
  }
}