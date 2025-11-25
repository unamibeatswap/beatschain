'use client'

import { useState, useEffect } from 'react'
import { useWeb3Data } from '@/context/Web3DataContext'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'
import { Beat } from '@/types'

interface RecommendationScore {
  beatId: string
  score: number
  reasons: string[]
}

export function useAIRecommendations() {
  const { beats } = useWeb3Data()
  const { user } = useUnifiedAuth()
  const [recommendations, setRecommendations] = useState<Beat[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (beats.length > 0) {
      generateRecommendations()
    }
  }, [beats, user])

  const generateRecommendations = async () => {
    setLoading(true)
    
    try {
      // Get user preferences from localStorage
      const userPreferences = getUserPreferences()
      
      // Score all beats based on multiple factors
      const scoredBeats = beats.map(beat => ({
        beat,
        score: calculateRecommendationScore(beat, userPreferences)
      }))
      
      // Sort by score and take top recommendations
      const topRecommendations = scoredBeats
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(item => item.beat)
      
      setRecommendations(topRecommendations)
    } catch (error) {
      console.error('Failed to generate recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserPreferences = () => {
    if (typeof window === 'undefined') return {}
    
    try {
      // Get user's purchase history
      const purchases = JSON.parse(localStorage.getItem('user_purchases') || '[]')
      
      // Get user's play history
      const playHistory = JSON.parse(localStorage.getItem('play_history') || '[]')
      
      // Get user's liked beats
      const likedBeats = JSON.parse(localStorage.getItem('liked_beats') || '[]')
      
      // Analyze preferences
      const genrePreferences = analyzeGenrePreferences([...purchases, ...playHistory, ...likedBeats])
      const bpmPreferences = analyzeBpmPreferences([...purchases, ...playHistory])
      const pricePreferences = analyzePricePreferences(purchases)
      
      return {
        genres: genrePreferences,
        bpmRange: bpmPreferences,
        priceRange: pricePreferences,
        recentActivity: playHistory.slice(-20)
      }
    } catch (error) {
      console.error('Failed to get user preferences:', error)
      return {}
    }
  }

  const calculateRecommendationScore = (beat: Beat, preferences: any): number => {
    let score = 0
    
    // Base popularity score (simulated)
    score += Math.random() * 10
    
    // Genre preference matching
    if (preferences.genres && preferences.genres[beat.genre]) {
      score += preferences.genres[beat.genre] * 20
    }
    
    // BPM preference matching
    if (preferences.bpmRange) {
      const bpmDiff = Math.abs(beat.bpm - preferences.bpmRange.preferred)
      score += Math.max(0, 15 - bpmDiff / 10)
    }
    
    // Price preference matching
    if (preferences.priceRange) {
      if (beat.price >= preferences.priceRange.min && beat.price <= preferences.priceRange.max) {
        score += 10
      }
    }
    
    // Recency boost for newer beats
    const daysSinceCreated = (Date.now() - beat.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceCreated < 7) {
      score += 5
    }
    
    // Avoid recommending user's own beats
    if (user?.address && beat.producerId.toLowerCase() === user.address.toLowerCase()) {
      score -= 50
    }
    
    return score
  }

  const analyzeGenrePreferences = (history: any[]) => {
    const genreCounts: Record<string, number> = {}
    
    history.forEach(item => {
      if (item.genre) {
        genreCounts[item.genre] = (genreCounts[item.genre] || 0) + 1
      }
    })
    
    // Normalize to preferences (0-1)
    const total = Object.values(genreCounts).reduce((sum, count) => sum + count, 0)
    const preferences: Record<string, number> = {}
    
    Object.entries(genreCounts).forEach(([genre, count]) => {
      preferences[genre] = count / total
    })
    
    return preferences
  }

  const analyzeBpmPreferences = (history: any[]) => {
    const bpms = history.map(item => item.bpm).filter(Boolean)
    if (bpms.length === 0) return null
    
    const avg = bpms.reduce((sum, bpm) => sum + bpm, 0) / bpms.length
    const variance = bpms.reduce((sum, bpm) => sum + Math.pow(bpm - avg, 2), 0) / bpms.length
    
    return {
      preferred: Math.round(avg),
      variance: Math.round(variance)
    }
  }

  const analyzePricePreferences = (purchases: any[]) => {
    const prices = purchases.map(item => item.price).filter(Boolean)
    if (prices.length === 0) return null
    
    prices.sort((a, b) => a - b)
    
    return {
      min: prices[0],
      max: prices[prices.length - 1],
      median: prices[Math.floor(prices.length / 2)]
    }
  }

  const trackInteraction = (beatId: string, action: 'play' | 'like' | 'purchase') => {
    if (typeof window === 'undefined') return
    
    try {
      const beat = beats.find(b => b.id === beatId)
      if (!beat) return
      
      const interaction = {
        beatId,
        action,
        genre: beat.genre,
        bpm: beat.bpm,
        price: beat.price,
        timestamp: new Date().toISOString()
      }
      
      const storageKey = action === 'purchase' ? 'user_purchases' : 
                        action === 'like' ? 'liked_beats' : 'play_history'
      
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]')
      existing.push(interaction)
      
      // Keep only last 100 interactions
      if (existing.length > 100) {
        existing.splice(0, existing.length - 100)
      }
      
      localStorage.setItem(storageKey, JSON.stringify(existing))
      
      // Regenerate recommendations after interaction
      setTimeout(generateRecommendations, 1000)
    } catch (error) {
      console.error('Failed to track interaction:', error)
    }
  }

  return {
    recommendations,
    loading,
    trackInteraction,
    refreshRecommendations: generateRecommendations
  }
}