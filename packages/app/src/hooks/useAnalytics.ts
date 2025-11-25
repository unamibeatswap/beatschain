'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

interface AnalyticsData {
  beatPerformance: {
    totalPlays: number
    totalSales: number
    totalRevenue: number
    topBeat: string | null
    averagePrice: number
  }
  marketTrends: {
    popularGenres: Array<{ genre: string; count: number }>
    priceRanges: Array<{ range: string; count: number }>
    salesByMonth: Array<{ month: string; sales: number }>
  }
  userBehavior: {
    conversionRate: number
    averageSessionTime: number
    bounceRate: number
    returnVisitors: number
  }
}

export function useAnalytics() {
  const { address } = useAccount()
  const [data, setData] = useState<AnalyticsData>({
    beatPerformance: {
      totalPlays: 0,
      totalSales: 0,
      totalRevenue: 0,
      topBeat: null,
      averagePrice: 0
    },
    marketTrends: {
      popularGenres: [],
      priceRanges: [],
      salesByMonth: []
    },
    userBehavior: {
      conversionRate: 0,
      averageSessionTime: 0,
      bounceRate: 0,
      returnVisitors: 0
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      if (typeof window === 'undefined') return

      try {
        // Aggregate data from localStorage
        const allBeats = JSON.parse(localStorage.getItem('all_beats') || '[]')
        const transactions = JSON.parse(localStorage.getItem('credit_transactions') || '[]')
        
        // Beat Performance
        const totalPlays = allBeats.reduce((sum: number, beat: any) => sum + (beat.plays || 0), 0)
        const totalSales = transactions.length
        const totalRevenue = transactions.reduce((sum: number, tx: any) => sum + (tx.cost || 0), 0)
        const topBeat = allBeats.sort((a: any, b: any) => (b.plays || 0) - (a.plays || 0))[0]?.id || null
        const averagePrice = allBeats.length > 0 ? allBeats.reduce((sum: number, beat: any) => sum + beat.price, 0) / allBeats.length : 0

        // Market Trends
        const genreCounts = allBeats.reduce((acc: any, beat: any) => {
          acc[beat.genre] = (acc[beat.genre] || 0) + 1
          return acc
        }, {})
        const popularGenres = Object.entries(genreCounts).map(([genre, count]) => ({ genre, count: count as number }))

        const priceRanges = [
          { range: '0-0.05 ETH', count: allBeats.filter((b: any) => b.price <= 0.05).length },
          { range: '0.05-0.1 ETH', count: allBeats.filter((b: any) => b.price > 0.05 && b.price <= 0.1).length },
          { range: '0.1+ ETH', count: allBeats.filter((b: any) => b.price > 0.1).length }
        ]

        // Mock monthly sales data
        const salesByMonth = [
          { month: 'Nov', sales: Math.floor(totalSales * 0.3) },
          { month: 'Dec', sales: Math.floor(totalSales * 0.7) }
        ]

        // User Behavior (mock data based on platform activity)
        const conversionRate = totalSales > 0 ? (totalSales / Math.max(totalPlays, 1)) * 100 : 0
        const averageSessionTime = 180 + Math.random() * 120 // 3-5 minutes
        const bounceRate = 35 + Math.random() * 20 // 35-55%
        const returnVisitors = Math.floor(totalSales * 0.6) // 60% return rate

        setData({
          beatPerformance: {
            totalPlays,
            totalSales,
            totalRevenue,
            topBeat,
            averagePrice
          },
          marketTrends: {
            popularGenres,
            priceRanges,
            salesByMonth
          },
          userBehavior: {
            conversionRate,
            averageSessionTime,
            bounceRate,
            returnVisitors
          }
        })
      } catch (error) {
        console.error('Analytics loading error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
    const interval = setInterval(loadAnalytics, 30000) // Update every 30s
    return () => clearInterval(interval)
  }, [address])

  return { data, loading }
}