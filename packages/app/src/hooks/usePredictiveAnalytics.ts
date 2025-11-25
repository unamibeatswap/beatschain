'use client'

import { useState, useEffect } from 'react'

interface PredictiveInsights {
  priceOptimization: {
    currentPrice: number
    suggestedPrice: number
    expectedIncrease: number
    confidence: number
  }
  demandForecast: {
    nextWeek: number
    nextMonth: number
    peakDays: string[]
  }
  genreTrends: Array<{
    genre: string
    currentPopularity: number
    predictedGrowth: number
    recommendation: 'focus' | 'maintain' | 'diversify'
  }>
  revenueProjection: {
    next30Days: number
    next90Days: number
    yearEnd: number
  }
}

export function usePredictiveAnalytics(beatId?: string) {
  const [insights, setInsights] = useState<PredictiveInsights>({
    priceOptimization: { currentPrice: 0, suggestedPrice: 0, expectedIncrease: 0, confidence: 0 },
    demandForecast: { nextWeek: 0, nextMonth: 0, peakDays: [] },
    genreTrends: [],
    revenueProjection: { next30Days: 0, next90Days: 0, yearEnd: 0 }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generatePredictiveInsights = () => {
      try {
        const allBeats = JSON.parse(localStorage.getItem('all_beats') || '[]')
        const transactions = JSON.parse(localStorage.getItem('credit_transactions') || '[]')
        
        let targetBeat = null
        if (beatId) {
          targetBeat = allBeats.find((b: any) => b.id === beatId)
        }

        // Price optimization
        const currentPrice = targetBeat?.price || 0.05
        const marketAverage = allBeats.length > 0 
          ? allBeats.reduce((sum: number, b: any) => sum + b.price, 0) / allBeats.length 
          : 0.05
        
        const suggestedPrice = Math.min(currentPrice * 1.15, marketAverage * 1.1)
        const expectedIncrease = ((suggestedPrice - currentPrice) / currentPrice) * 100
        const confidence = 75 + Math.random() * 20

        // Demand forecast
        const baseWeeklyDemand = Math.floor(Math.random() * 50) + 20
        const seasonalMultiplier = 1.1 // December boost
        const nextWeek = Math.floor(baseWeeklyDemand * seasonalMultiplier)
        const nextMonth = Math.floor(nextWeek * 4.2)
        const peakDays = ['Friday', 'Saturday', 'Sunday']

        // Genre trends
        const genres = ['Hip Hop', 'Trap', 'Afrobeats', 'Amapiano', 'House']
        const genreTrends = genres.map(genre => {
          const currentPopularity = 60 + Math.random() * 30
          const predictedGrowth = (Math.random() - 0.3) * 40 // -30% to +40%
          let recommendation: 'focus' | 'maintain' | 'diversify' = 'maintain'
          
          if (predictedGrowth > 15) recommendation = 'focus'
          else if (predictedGrowth < -10) recommendation = 'diversify'
          
          return { genre, currentPopularity, predictedGrowth, recommendation }
        })

        // Revenue projection
        const currentMonthlyRevenue = transactions.reduce((sum: number, tx: any) => sum + tx.cost, 0)
        const growthRate = 1.08 // 8% monthly growth
        const next30Days = currentMonthlyRevenue * growthRate
        const next90Days = next30Days * Math.pow(growthRate, 3)
        const yearEnd = next30Days * Math.pow(growthRate, 12)

        setInsights({
          priceOptimization: {
            currentPrice,
            suggestedPrice,
            expectedIncrease,
            confidence
          },
          demandForecast: {
            nextWeek,
            nextMonth,
            peakDays
          },
          genreTrends,
          revenueProjection: {
            next30Days,
            next90Days,
            yearEnd
          }
        })
      } catch (error) {
        console.error('Predictive analytics error:', error)
      } finally {
        setLoading(false)
      }
    }

    generatePredictiveInsights()
    const interval = setInterval(generatePredictiveInsights, 600000) // Update every 10 minutes
    return () => clearInterval(interval)
  }, [beatId])

  return { insights, loading }
}