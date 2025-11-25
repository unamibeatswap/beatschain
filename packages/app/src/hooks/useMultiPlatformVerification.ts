'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'

interface PlatformVerification {
  youtube?: { channelId: string; subscribers: number; verified: boolean }
  tiktok?: { username: string; followers: number; verified: boolean }
  patreon?: { creatorId: string; subscribers: number; monthlyRevenue: number }
  twitch?: { username: string; followers: number; verified: boolean }
}

export function useMultiPlatformVerification() {
  const [loading, setLoading] = useState(false)

  const verifyYouTube = async (channelId: string): Promise<{ subscribers: number; verified: boolean } | null> => {
    setLoading(true)
    try {
      // Simulate YouTube API verification
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockData = {
        subscribers: Math.floor(Math.random() * 500000) + 1000,
        verified: Math.random() > 0.4 // 60% chance of verification
      }
      
      toast.success(`📺 YouTube verified: ${mockData.subscribers.toLocaleString()} subscribers`)
      return mockData
    } catch (error) {
      toast.error('YouTube verification failed')
      return null
    } finally {
      setLoading(false)
    }
  }

  const verifyTikTok = async (username: string): Promise<{ followers: number; verified: boolean } | null> => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      const mockData = {
        followers: Math.floor(Math.random() * 1000000) + 5000,
        verified: Math.random() > 0.5 // 50% chance of verification
      }
      
      toast.success(`🎵 TikTok verified: ${mockData.followers.toLocaleString()} followers`)
      return mockData
    } catch (error) {
      toast.error('TikTok verification failed')
      return null
    } finally {
      setLoading(false)
    }
  }

  const verifyPatreon = async (creatorId: string): Promise<{ subscribers: number; monthlyRevenue: number } | null> => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockData = {
        subscribers: Math.floor(Math.random() * 10000) + 50,
        monthlyRevenue: Math.floor(Math.random() * 15000) + 200
      }
      
      toast.success(`💰 Patreon verified: ${mockData.subscribers} patrons, $${mockData.monthlyRevenue}/month`)
      return mockData
    } catch (error) {
      toast.error('Patreon verification failed')
      return null
    } finally {
      setLoading(false)
    }
  }

  const calculateTierFromPlatforms = (platforms: PlatformVerification): 'bronze' | 'silver' | 'gold' | 'platinum' => {
    let score = 0

    // YouTube scoring
    if (platforms.youtube) {
      if (platforms.youtube.subscribers >= 1000000) score += 40
      else if (platforms.youtube.subscribers >= 100000) score += 30
      else if (platforms.youtube.subscribers >= 10000) score += 20
      else if (platforms.youtube.subscribers >= 1000) score += 10
      
      if (platforms.youtube.verified) score += 15
    }

    // TikTok scoring
    if (platforms.tiktok) {
      if (platforms.tiktok.followers >= 1000000) score += 35
      else if (platforms.tiktok.followers >= 100000) score += 25
      else if (platforms.tiktok.followers >= 10000) score += 15
      else if (platforms.tiktok.followers >= 1000) score += 8
      
      if (platforms.tiktok.verified) score += 15
    }

    // Patreon scoring (high value due to revenue)
    if (platforms.patreon) {
      if (platforms.patreon.monthlyRevenue >= 5000) score += 25
      else if (platforms.patreon.monthlyRevenue >= 1000) score += 20
      else if (platforms.patreon.monthlyRevenue >= 500) score += 15
      else if (platforms.patreon.monthlyRevenue >= 100) score += 10
    }

    // Determine tier
    if (score >= 80) return 'platinum'
    if (score >= 60) return 'gold'
    if (score >= 35) return 'silver'
    return 'bronze'
  }

  return {
    loading,
    verifyYouTube,
    verifyTikTok,
    verifyPatreon,
    calculateTierFromPlatforms
  }
}