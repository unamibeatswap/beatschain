'use client'

import { useState, useEffect } from 'react'
import { useContentCreator } from './useContentCreator'

interface CreatorAnalytics {
  totalLicenses: number
  totalSpent: number
  avgLicensePrice: number
  successRate: number
  topGenres: string[]
  monthlyTrend: number[]
  platformPerformance: {
    youtube: { views: number; engagement: number }
    tiktok: { views: number; engagement: number }
    patreon: { growth: number; revenue: number }
  }
  aiRecommendations: {
    pricingStrategy: string
    genreTargets: string[]
    timingOptimization: string
  }
}

export function useCreatorAnalytics() {
  const { creator, licenses } = useContentCreator()
  const [analytics, setAnalytics] = useState<CreatorAnalytics | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (creator) {
      generateAnalytics()
    }
  }, [creator, licenses])

  const generateAnalytics = async () => {
    if (!creator) return
    
    setLoading(true)
    try {
      // Calculate real analytics from actual data
      const negotiations = JSON.parse(localStorage.getItem('pending_negotiations') || '[]')
      const creatorNegotiations = negotiations.filter((n: any) => n.creatorAddress === creator.walletAddress)
      
      const realAnalytics: CreatorAnalytics = {
        totalLicenses: licenses.length,
        totalSpent: licenses.reduce((sum, l) => sum + l.negotiatedPrice, 0),
        avgLicensePrice: licenses.length > 0 ? licenses.reduce((sum, l) => sum + l.negotiatedPrice, 0) / licenses.length : 0,
        successRate: creatorNegotiations.length > 0 ? 
          (creatorNegotiations.filter((n: any) => n.status === 'accepted').length / creatorNegotiations.length) * 100 : 0,
        topGenres: getTopGenresFromLicenses(licenses),
        monthlyTrend: getMonthlyTrendFromLicenses(licenses),
        platformPerformance: {
          youtube: { 
            views: creator.platformConnections.youtube?.subscribers || 0,
            engagement: 0 // Real data would come from YouTube API
          },
          tiktok: { 
            views: creator.platformConnections.tiktok?.followers || 0,
            engagement: 0 // Real data would come from TikTok API
          },
          patreon: { 
            growth: 0, // Real data would come from Patreon API
            revenue: creator.platformConnections.patreon?.monthlyRevenue || 0 
          }
        },
        aiRecommendations: {
          pricingStrategy: getTierPricingStrategy(creator.verificationTier),
          genreTargets: getRecommendedGenres(creator.creatorType),
          timingOptimization: getOptimalTiming(creator.creatorType)
        }
      }
      
      setAnalytics(realAnalytics)
    } catch (error) {
      console.error('Failed to generate analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTopGenresFromLicenses = (licenses: any[]): string[] => {
    const genreCounts: { [key: string]: number } = {}
    licenses.forEach(license => {
      const genre = license.genre || 'Hip Hop'
      genreCounts[genre] = (genreCounts[genre] || 0) + 1
    })
    return Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)
      .map(([genre]) => genre)
  }

  const getMonthlyTrendFromLicenses = (licenses: any[]): number[] => {
    const monthlyData = new Array(6).fill(0)
    licenses.forEach(license => {
      const monthsAgo = Math.floor((Date.now() - new Date(license.createdAt).getTime()) / (30 * 24 * 60 * 60 * 1000))
      if (monthsAgo < 6) {
        monthlyData[5 - monthsAgo] += license.negotiatedPrice
      }
    })
    return monthlyData
  }

  const getTierPricingStrategy = (tier: string): string => {
    switch (tier) {
      case 'platinum': return 'Premium pricing: Negotiate 35-45% royalty shares'
      case 'gold': return 'Competitive pricing: Target 25-35% royalty shares'
      case 'silver': return 'Market pricing: Aim for 20-30% royalty shares'
      default: return 'Conservative pricing: Start with 15-25% royalty shares'
    }
  }

  const getRecommendedGenres = (creatorType: string): string[] => {
    const genreMap = {
      'youtuber': ['Hip Hop', 'Pop', 'Electronic', 'Lo-Fi'],
      'tiktoker': ['Trap', 'Pop', 'Dance', 'Viral'],
      'podcaster': ['Ambient', 'Jazz', 'Lo-Fi', 'Instrumental'],
      'filmmaker': ['Cinematic', 'Ambient', 'Classical', 'Electronic'],
      'gamedev': ['Electronic', 'Synthwave', 'Ambient', 'Chiptune'],
      'streamer': ['Electronic', 'Hip Hop', 'Gaming', 'Energetic']
    }
    return genreMap[creatorType] || ['Hip Hop', 'Pop', 'Electronic']
  }

  const getOptimalTiming = (creatorType: string): string => {
    const timingMap = {
      'youtuber': 'License 2-3 days before upload for best ROI',
      'tiktoker': 'License same-day for trending content',
      'podcaster': 'License weekly in batches for consistency',
      'filmmaker': 'License 1-2 weeks before production',
      'gamedev': 'License during development sprints',
      'streamer': 'License daily for fresh content'
    }
    return timingMap[creatorType] || 'License based on content schedule'
  }

  return {
    analytics,
    loading,
    refreshAnalytics: generateAnalytics
  }
}