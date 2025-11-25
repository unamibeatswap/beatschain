'use client'

import { useState, useEffect } from 'react'
import { useWeb3Events } from './useWeb3Events'

export interface AdminAnalytics {
  platformStats: {
    totalBeats: number
    totalSales: number
    totalRevenue: string
    totalUsers: number
    averagePrice: string
  }
  recentActivity: Array<{
    type: 'mint' | 'purchase' | 'transfer'
    user: string
    beatId: string
    amount?: string
    timestamp: Date
  }>
  topPerformers: Array<{
    producer: string
    totalSales: number
    totalRevenue: string
  }>
  dailyStats: Array<{
    date: string
    mints: number
    sales: number
    revenue: string
  }>
}

export function useAdminAnalytics() {
  const [analytics, setAnalytics] = useState<AdminAnalytics>({
    platformStats: {
      totalBeats: 0,
      totalSales: 0,
      totalRevenue: '0',
      totalUsers: 0,
      averagePrice: '0'
    },
    recentActivity: [],
    topPerformers: [],
    dailyStats: []
  })
  const [loading, setLoading] = useState(true)
  
  const { events } = useWeb3Events()

  useEffect(() => {
    processWeb3Analytics()
  }, [events])

  const processWeb3Analytics = () => {
    // Count unique wallet addresses from events
    const uniqueWallets = new Set([
      ...events.map(e => e.data?.producer).filter(Boolean),
      ...events.map(e => e.data?.buyer).filter(Boolean),
      ...events.map(e => e.data?.to).filter(Boolean)
    ])
    
    const totalUsers = Math.max(1, uniqueWallets.size) // At least 1 (admin)

    // Platform-wide statistics
    const mintEvents = events.filter(e => e.type === 'mint')
    const saleEvents = events.filter(e => e.type === 'purchase')
    
    const totalBeats = mintEvents.length
    const totalSales = saleEvents.length
    
    const totalRevenue = saleEvents.reduce((sum, event) => 
      sum + parseFloat(event.data?.price || '0'), 0
    ).toString()
    
    const averagePrice = totalSales > 0 
      ? (parseFloat(totalRevenue) / totalSales).toString()
      : '0'

    // Recent activity across platform
    const recentActivity = events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 20)
      .map(event => ({
        type: event.type,
        user: event.data.producer || event.data.buyer || event.data.from || 'Unknown',
        beatId: event.tokenId,
        amount: event.data.price || event.data.amount,
        timestamp: event.timestamp
      }))

    // Top performing producers
    const producerStats = saleEvents.reduce((acc, event) => {
      const producer = event.data.seller || event.data.producer
      if (!producer) return acc
      
      if (!acc[producer]) {
        acc[producer] = { totalSales: 0, totalRevenue: 0 }
      }
      
      acc[producer].totalSales += 1
      acc[producer].totalRevenue += parseFloat(event.data.price || '0')
      
      return acc
    }, {} as Record<string, { totalSales: number, totalRevenue: number }>)

    const topPerformers = Object.entries(producerStats)
      .sort(([,a], [,b]) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10)
      .map(([producer, stats]) => ({
        producer,
        totalSales: stats.totalSales,
        totalRevenue: stats.totalRevenue.toString()
      }))

    // Daily statistics (last 30 days)
    const dailyStats = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayEvents = events.filter(event => 
        event.timestamp.toISOString().split('T')[0] === dateStr
      )
      
      const dayMints = dayEvents.filter(e => e.type === 'mint').length
      const daySales = dayEvents.filter(e => e.type === 'purchase')
      const dayRevenue = daySales.reduce((sum, event) => 
        sum + parseFloat(event.data.price || '0'), 0
      ).toString()
      
      return {
        date: dateStr,
        mints: dayMints,
        sales: daySales.length,
        revenue: dayRevenue
      }
    }).reverse()

    setAnalytics({
      platformStats: {
        totalBeats,
        totalSales,
        totalRevenue,
        totalUsers,
        averagePrice
      },
      recentActivity,
      topPerformers,
      dailyStats
    })

    setLoading(false)
  }

  return { analytics, loading }
}