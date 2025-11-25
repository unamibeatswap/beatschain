'use client'

import { useState, useEffect } from 'react'

interface BehaviorAnalytics {
  userJourney: {
    discoveryMethods: Array<{ method: string; percentage: number }>
    conversionFunnel: Array<{ stage: string; users: number; dropoff: number }>
    retentionRates: Array<{ period: string; rate: number }>
  }
  engagement: {
    averageSessionTime: number
    pagesPerSession: number
    bounceRate: number
    returnVisitorRate: number
  }
  creditSystemEffectiveness: {
    freeToProConversion: number
    creditUtilization: number
    averageCreditsPerUser: number
  }
}

export function useBehaviorAnalytics() {
  const [analytics, setAnalytics] = useState<BehaviorAnalytics>({
    userJourney: {
      discoveryMethods: [],
      conversionFunnel: [],
      retentionRates: []
    },
    engagement: {
      averageSessionTime: 0,
      pagesPerSession: 0,
      bounceRate: 0,
      returnVisitorRate: 0
    },
    creditSystemEffectiveness: {
      freeToProConversion: 0,
      creditUtilization: 0,
      averageCreditsPerUser: 0
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBehaviorAnalytics = () => {
      try {
        // Mock behavior analytics based on platform activity
        const discoveryMethods = [
          { method: 'Direct', percentage: 35 },
          { method: 'Social Media', percentage: 28 },
          { method: 'Search', percentage: 22 },
          { method: 'Referral', percentage: 15 }
        ]

        const conversionFunnel = [
          { stage: 'Visitors', users: 1000, dropoff: 0 },
          { stage: 'Beat Preview', users: 650, dropoff: 35 },
          { stage: 'Wallet Connect', users: 320, dropoff: 51 },
          { stage: 'Purchase', users: 48, dropoff: 85 }
        ]

        const retentionRates = [
          { period: '1 Day', rate: 68 },
          { period: '7 Days', rate: 42 },
          { period: '30 Days', rate: 28 },
          { period: '90 Days', rate: 18 }
        ]

        // Calculate credit system metrics
        const allBalances = Object.keys(localStorage)
          .filter(key => key.startsWith('beatnft_balance_'))
          .map(key => JSON.parse(localStorage.getItem(key) || '{}'))

        const totalUsers = allBalances.length
        const proUsers = allBalances.filter(b => b.hasProNFT).length
        const totalCreditsIssued = allBalances.reduce((sum, b) => sum + (b.credits + b.totalUsed), 0)
        const totalCreditsUsed = allBalances.reduce((sum, b) => sum + b.totalUsed, 0)

        setAnalytics({
          userJourney: {
            discoveryMethods,
            conversionFunnel,
            retentionRates
          },
          engagement: {
            averageSessionTime: 185 + Math.random() * 60, // 3-4 minutes
            pagesPerSession: 3.2 + Math.random() * 1.5,
            bounceRate: 42 + Math.random() * 15,
            returnVisitorRate: 35 + Math.random() * 20
          },
          creditSystemEffectiveness: {
            freeToProConversion: totalUsers > 0 ? (proUsers / totalUsers) * 100 : 0,
            creditUtilization: totalCreditsIssued > 0 ? (totalCreditsUsed / totalCreditsIssued) * 100 : 0,
            averageCreditsPerUser: totalUsers > 0 ? totalCreditsIssued / totalUsers : 10
          }
        })
      } catch (error) {
        console.error('Behavior analytics error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBehaviorAnalytics()
    const interval = setInterval(loadBehaviorAnalytics, 300000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [])

  return { analytics, loading }
}