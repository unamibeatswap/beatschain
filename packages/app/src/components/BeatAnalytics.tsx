'use client'

import { useState, useEffect } from 'react'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'
import { useWeb3Events } from '@/hooks/useWeb3Events'
import { useWeb3Data } from '@/context/Web3DataContext'
import { Beat } from '@/types'
import DashboardAudioPlayer from '@/components/DashboardAudioPlayer'

interface BeatPerformance {
  beatId: string
  title: string
  totalSales: number
  totalRevenue: number
  averagePrice: number
  lastSale?: Date
  royaltiesEarned: number
  viewCount: number
}

export default function BeatAnalytics() {
  const { user } = useUnifiedAuth()
  const { events } = useWeb3Events()
  const { beats } = useWeb3Data()
  const [analytics, setAnalytics] = useState<BeatPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  useEffect(() => {
    if (user?.address) {
      calculateBeatAnalytics()
    }
  }, [user?.address, events, beats, selectedPeriod])

  const calculateBeatAnalytics = () => {
    if (!user?.address) return

    setLoading(true)
    try {
      // Get producer's beats
      const producerBeats = beats.filter(beat => 
        beat.producerId.toLowerCase() === user.address.toLowerCase()
      )

      // Calculate period filter
      const now = new Date()
      const periodStart = new Date()
      switch (selectedPeriod) {
        case '7d':
          periodStart.setDate(now.getDate() - 7)
          break
        case '30d':
          periodStart.setDate(now.getDate() - 30)
          break
        case '90d':
          periodStart.setDate(now.getDate() - 90)
          break
        case 'all':
          periodStart.setFullYear(2020) // Far back date
          break
      }

      // Filter events for the selected period
      const periodEvents = events.filter(event => 
        event.timestamp >= periodStart
      )

      const beatAnalytics: BeatPerformance[] = producerBeats.map(beat => {
        // Get sales events for this beat
        const beatSales = periodEvents.filter(event => 
          event.type === 'purchase' && 
          event.tokenId === beat.id &&
          (event.data.seller?.toLowerCase() === user.address.toLowerCase() ||
           event.data.producer?.toLowerCase() === user.address.toLowerCase())
        )

        // Get royalty events for this beat
        const beatRoyalties = periodEvents.filter(event =>
          event.type === 'royalty' &&
          event.tokenId === beat.id &&
          event.data.recipient?.toLowerCase() === user.address.toLowerCase()
        )

        // Calculate metrics
        const totalSales = beatSales.length
        const totalRevenue = beatSales.reduce((sum, sale) => 
          sum + parseFloat(sale.data.price || '0'), 0
        )
        const royaltiesEarned = beatRoyalties.reduce((sum, royalty) =>
          sum + parseFloat(royalty.data.amount || '0'), 0
        )
        const averagePrice = totalSales > 0 ? totalRevenue / totalSales : 0
        const lastSale = beatSales.length > 0 
          ? beatSales.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0].timestamp
          : undefined

        // Simulate view count (in real app, this would come from analytics service)
        const viewCount = Math.floor(Math.random() * 1000) + totalSales * 10

        return {
          beatId: beat.id,
          title: beat.title,
          totalSales,
          totalRevenue,
          averagePrice,
          lastSale,
          royaltiesEarned,
          viewCount
        }
      })

      // Sort by total revenue (best performing first)
      beatAnalytics.sort((a, b) => b.totalRevenue - a.totalRevenue)
      
      setAnalytics(beatAnalytics)
    } catch (error) {
      console.error('Failed to calculate beat analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }

  const totalMetrics = analytics.reduce((acc, beat) => ({
    totalSales: acc.totalSales + beat.totalSales,
    totalRevenue: acc.totalRevenue + beat.totalRevenue,
    totalRoyalties: acc.totalRoyalties + beat.royaltiesEarned,
    totalViews: acc.totalViews + beat.viewCount
  }), { totalSales: 0, totalRevenue: 0, totalRoyalties: 0, totalViews: 0 })

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">📊 Beat Analytics</h2>
          <div className="flex gap-2">
            {(['7d', '30d', '90d', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-sm rounded-md ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period === 'all' ? 'All Time' : period.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalMetrics.totalSales}</div>
            <div className="text-sm text-gray-600">Total Sales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {totalMetrics.totalRevenue.toFixed(3)} ETH
            </div>
            <div className="text-sm text-gray-600">Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {totalMetrics.totalRoyalties.toFixed(3)} ETH
            </div>
            <div className="text-sm text-gray-600">Royalties</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {totalMetrics.totalViews.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
        </div>
      </div>

      {/* Beat Performance Table */}
      <div className="overflow-x-auto">
        {analytics.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-600 mb-2">No analytics data available</p>
            <p className="text-sm text-gray-500">
              Upload beats and make sales to see detailed analytics here
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Royalties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Sale
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.map((beat) => (
                <tr key={beat.beatId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="w-64">
                      <DashboardAudioPlayer 
                        beat={{
                          id: beat.beatId,
                          title: beat.title,
                          genre: 'Unknown',
                          bpm: 120,
                          price: beat.averagePrice,
                          producerId: user?.address || '',
                          coverImageUrl: '',
                          audioUrl: '',
                          isActive: true,
                          key: 'C',
                          description: ''
                        }}
                        variant="analytics"
                        showMetrics={true}
                        className="mb-0"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{beat.totalSales}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {beat.totalRevenue.toFixed(3)} ETH
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {beat.averagePrice.toFixed(3)} ETH
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-purple-600">
                      {beat.royaltiesEarned.toFixed(3)} ETH
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {beat.lastSale ? formatTimeAgo(beat.lastSale) : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}