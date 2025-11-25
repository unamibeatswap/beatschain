'use client'

import { useState, useEffect } from 'react'

interface BeatAnalytics {
  beatId: string
  title: string
  plays: number
  sales: number
  revenue: number
  conversionRate: number
  averageListenTime: number
  geographicData: Array<{ country: string; plays: number }>
  priceHistory: Array<{ date: string; price: number }>
  engagement: {
    likes: number
    shares: number
    downloads: number
  }
}

export function useBeatAnalytics(beatId?: string) {
  const [analytics, setAnalytics] = useState<BeatAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!beatId) return

    const loadBeatAnalytics = () => {
      try {
        // Get beat data from localStorage
        const allBeats = JSON.parse(localStorage.getItem('all_beats') || '[]')
        const beat = allBeats.find((b: any) => b.id === beatId)
        
        if (!beat) {
          setAnalytics(null)
          setLoading(false)
          return
        }

        // Generate analytics data
        const plays = beat.plays || Math.floor(Math.random() * 500) + 50
        const sales = Math.floor(plays * 0.05) // 5% conversion rate
        const revenue = sales * (beat.price || 0.05)
        const conversionRate = plays > 0 ? (sales / plays) * 100 : 0
        
        // Mock geographic data
        const countries = ['South Africa', 'Nigeria', 'Ghana', 'Kenya', 'USA', 'UK', 'Canada']
        const geographicData = countries.map(country => ({
          country,
          plays: Math.floor(Math.random() * plays * 0.3)
        })).sort((a, b) => b.plays - a.plays).slice(0, 5)

        // Mock price history
        const priceHistory = Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          price: beat.price + (Math.random() - 0.5) * 0.01
        }))

        setAnalytics({
          beatId,
          title: beat.title,
          plays,
          sales,
          revenue,
          conversionRate,
          averageListenTime: 45 + Math.random() * 30, // 45-75 seconds
          geographicData,
          priceHistory,
          engagement: {
            likes: Math.floor(plays * 0.1),
            shares: Math.floor(plays * 0.02),
            downloads: sales
          }
        })
      } catch (error) {
        console.error('Error loading beat analytics:', error)
        setAnalytics(null)
      } finally {
        setLoading(false)
      }
    }

    loadBeatAnalytics()
    const interval = setInterval(loadBeatAnalytics, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [beatId])

  return { analytics, loading }
}