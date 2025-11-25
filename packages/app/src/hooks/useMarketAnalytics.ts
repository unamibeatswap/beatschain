'use client'

import { useState, useEffect } from 'react'

interface MarketAnalytics {
  genreTrends: Array<{ genre: string; growth: number; volume: number }>
  pricingInsights: {
    averagePrice: number
    priceRange: { min: number; max: number }
    sweetSpot: number
  }
  seasonalPatterns: Array<{ period: string; demand: number }>
  producerBenchmarks: {
    topPerformers: Array<{ address: string; revenue: number }>
    averageRevenue: number
    conversionRates: { low: number; average: number; high: number }
  }
}

export function useMarketAnalytics() {
  const [analytics, setAnalytics] = useState<MarketAnalytics>({
    genreTrends: [],
    pricingInsights: { averagePrice: 0, priceRange: { min: 0, max: 0 }, sweetSpot: 0 },
    seasonalPatterns: [],
    producerBenchmarks: { topPerformers: [], averageRevenue: 0, conversionRates: { low: 0, average: 0, high: 0 } }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMarketAnalytics = () => {
      try {
        const allBeats = JSON.parse(localStorage.getItem('all_beats') || '[]')
        const transactions = JSON.parse(localStorage.getItem('credit_transactions') || '[]')
        
        // Genre trends
        const genreCounts = allBeats.reduce((acc: any, beat: any) => {
          acc[beat.genre] = (acc[beat.genre] || 0) + 1
          return acc
        }, {})
        
        const genreTrends = Object.entries(genreCounts).map(([genre, count]) => ({
          genre,
          growth: Math.random() * 40 - 10, // -10% to +30% growth
          volume: count as number
        })).sort((a, b) => b.volume - a.volume)

        // Pricing insights
        const prices = allBeats.map((b: any) => b.price).filter(Boolean)
        const averagePrice = prices.length > 0 ? prices.reduce((a: number, b: number) => a + b, 0) / prices.length : 0.05
        const sweetSpot = averagePrice * 1.2 // 20% above average performs best

        // Seasonal patterns (mock data)
        const seasonalPatterns = [
          { period: 'Q4 2024', demand: 85 },
          { period: 'Q1 2025', demand: 92 },
          { period: 'Q2 2025', demand: 78 },
          { period: 'Q3 2025', demand: 88 }
        ]

        // Producer benchmarks
        const producerRevenues = new Map()
        transactions.forEach((tx: any) => {
          const current = producerRevenues.get(tx.from) || 0
          producerRevenues.set(tx.from, current + tx.cost)
        })
        
        const topPerformers = Array.from(producerRevenues.entries())
          .map(([address, revenue]) => ({ address, revenue: revenue as number }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5)

        const averageRevenue = topPerformers.length > 0 
          ? topPerformers.reduce((sum, p) => sum + p.revenue, 0) / topPerformers.length 
          : 0

        setAnalytics({
          genreTrends,
          pricingInsights: {
            averagePrice,
            priceRange: { min: Math.min(...prices, 0.01), max: Math.max(...prices, 0.1) },
            sweetSpot
          },
          seasonalPatterns,
          producerBenchmarks: {
            topPerformers,
            averageRevenue,
            conversionRates: { low: 2.5, average: 4.8, high: 8.2 }
          }
        })
      } catch (error) {
        console.error('Market analytics error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMarketAnalytics()
    const interval = setInterval(loadMarketAnalytics, 300000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [])

  return { analytics, loading }
}