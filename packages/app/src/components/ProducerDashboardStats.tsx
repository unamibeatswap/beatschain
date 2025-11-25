'use client'

import { useState, useEffect } from 'react'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'
import { useBeatNFT } from '@/hooks/useBeatNFT'
import { useProducerStats } from '@/hooks/useProducerStats'
import { useWeb3Data } from '@/context/Web3DataContext'
import { useRealtimeAnalytics } from '@/hooks/useRealtimeAnalytics'
import { useOptimisticUpdates } from '@/hooks/useOptimisticUpdates'
import { LinkComponent } from '@/components/LinkComponent'
import { LoadingSpinner, DashboardStatsSkeleton, TransactionStatus } from '@/components/LoadingStates'

// Phase 4E: Creator Negotiations Component
function CreatorNegotiationsCard() {
  const [negotiations, setNegotiations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNegotiations()
  }, [])

  const loadNegotiations = async () => {
    try {
      const stored = localStorage.getItem('pending_negotiations') || '[]'
      const allNegotiations = JSON.parse(stored)
      setNegotiations(allNegotiations.slice(0, 3)) // Show latest 3
    } catch (error) {
      console.error('Failed to load negotiations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNegotiation = async (negotiationId: string, action: 'accept' | 'reject' | 'counter') => {
    // Implementation for negotiation handling
    console.log(`${action} negotiation ${negotiationId}`)
  }

  if (loading) return <div className="bg-white rounded-lg shadow border p-6">Loading negotiations...</div>

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">🤝 Creator Negotiations</h2>
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Phase 4E
          </span>
        </div>
      </div>
      <div className="p-6">
        {negotiations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎨</div>
            <p className="text-gray-600 mb-2">No creator negotiations yet</p>
            <p className="text-sm text-gray-500">Content creators will be able to negotiate licenses for your BeatNFTs™</p>
          </div>
        ) : (
          <div className="space-y-4">
            {negotiations.map((negotiation, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      BeatNFT™ #{negotiation.beatNftId}
                    </p>
                    <p className="text-sm text-gray-600">
                      {negotiation.creatorType} • {negotiation.creatorTier} tier
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${negotiation.proposedPrice}</p>
                    <p className="text-xs text-gray-500">Creator: {negotiation.proposedRoyaltyShare}% • Platform: 15%</p>
                  </div>
                </div>
                {negotiation.message && (
                  <p className="text-sm text-gray-600 mb-3 italic">"{negotiation.message}"</p>
                )}
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleNegotiation(negotiation.id, 'accept')}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleNegotiation(negotiation.id, 'counter')}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Counter
                  </button>
                  <button 
                    onClick={() => handleNegotiation(negotiation.id, 'reject')}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface ProducerStats {
  totalBeats: number
  totalSales: number
  totalEarnings: number
  creditsUsed: number
  creditsRemaining: number
  recentActivity: Array<{
    type: 'upload' | 'sale' | 'credit_purchase'
    description: string
    timestamp: Date
    amount?: number
  }>
}

export default function ProducerDashboardStats() {
  const { user } = useUnifiedAuth()
  const { balance } = useBeatNFT()
  const { stats: blockchainStats, loading: statsLoading } = useProducerStats()
  const { beats } = useWeb3Data()
  const { metrics: realtimeMetrics, loading: analyticsLoading } = useRealtimeAnalytics()
  const { pendingUpdates } = useOptimisticUpdates()
  const [stats, setStats] = useState<ProducerStats>({
    totalBeats: 0,
    totalSales: 0,
    totalEarnings: 0,
    creditsUsed: 0,
    creditsRemaining: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducerStats()
    const interval = setInterval(loadProducerStats, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [user, balance, blockchainStats, beats])

  const loadProducerStats = async () => {
    if (!user?.address || typeof window === 'undefined') return

    try {
      setLoading(true)
      
      // Use real blockchain data from useProducerStats
      const producerBeats = beats.filter(beat => 
        beat.producerId.toLowerCase() === user.address.toLowerCase()
      )
      
      const blockchainEarnings = Math.max(parseFloat(blockchainStats.totalEarnings), realtimeMetrics.totalRevenue)
      const blockchainSales = Math.max(blockchainStats.totalSales, realtimeMetrics.totalSales)
      
      // Generate recent activity from blockchain data and local actions
      const recentActivity = [
        // Blockchain activity
        ...blockchainStats.recentActivity.map(activity => ({
          type: activity.type === 'mint' ? 'upload' as const : 'sale' as const,
          description: activity.type === 'mint' 
            ? `Minted beat #${activity.beatId}` 
            : `Sold beat #${activity.beatId} for ${activity.amount} ETH`,
          timestamp: activity.timestamp,
          amount: activity.amount ? parseFloat(activity.amount) : undefined
        })),
        // Credit system activity
        ...(balance.totalUsed > 0 ? [{
          type: 'upload' as const,
          description: `Used ${balance.totalUsed} BeatNFT credits`,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          amount: balance.totalUsed
        }] : []),
        ...(balance.hasProNFT ? [{
          type: 'credit_purchase' as const,
          description: 'Upgraded to Pro BeatNFT - Unlimited uploads',
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          amount: 0.1
        }] : [])
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5)

      setStats({
        totalBeats: Math.max(producerBeats.length, blockchainStats.totalBeats),
        totalSales: Math.max(blockchainSales, 0),
        totalEarnings: Math.max(blockchainEarnings, 0),
        creditsUsed: balance.totalUsed,
        creditsRemaining: balance.hasProNFT ? -1 : balance.credits,
        recentActivity
      })
      
    } catch (error) {
      console.error('Error loading producer stats:', error)
    } finally {
      setLoading(statsLoading || analyticsLoading)
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return '🎵'
      case 'sale': return '💰'
      case 'credit_purchase': return '🎫'
      default: return '📊'
    }
  }

  if (loading) {
    return <DashboardStatsSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Pending Transactions Alert */}
      {pendingUpdates > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" color="blue" />
            <span className="text-blue-800 font-medium">
              {pendingUpdates} transaction{pendingUpdates > 1 ? 's' : ''} pending confirmation
            </span>
          </div>
        </div>
      )}
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Beats</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.totalBeats}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-2xl">🎵</span>
            </div>
          </div>
          <div className="mt-2">
            <LinkComponent href="/upload" className="text-blue-600 text-sm hover:underline">
              Upload new beat →
            </LinkComponent>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
              {realtimeMetrics.averagePrice > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Avg: {realtimeMetrics.averagePrice.toFixed(3)} ETH
                </p>
              )}
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="mt-2">
            <LinkComponent href="/analytics" className="text-green-600 text-sm hover:underline">
              View analytics →
            </LinkComponent>
            {realtimeMetrics.topBeat && (
              <p className="text-xs text-gray-500">
                Top: Beat #{realtimeMetrics.topBeat}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Credits Used</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.creditsUsed}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <span className="text-2xl">🎫</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-purple-600 text-sm">
              {stats.creditsRemaining === -1 ? 'Unlimited remaining' : `${stats.creditsRemaining} remaining`}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Account Status</p>
              <p className="text-lg font-bold text-gray-900">
                {balance.hasProNFT ? 'Pro BeatNFT' : 'Free Tier'}
              </p>
            </div>
            <div className={`p-3 rounded-full ${balance.hasProNFT ? 'bg-yellow-100' : 'bg-gray-100'}`}>
              <span className="text-2xl">{balance.hasProNFT ? '♾️' : '🆓'}</span>
            </div>
          </div>
          <div className="mt-2">
            {!balance.hasProNFT && (
              <LinkComponent href="/manage-subscription" className="text-yellow-600 text-sm hover:underline">
                Upgrade to Pro →
              </LinkComponent>
            )}
            {balance.hasProNFT && (
              <span className="text-yellow-600 text-sm">Unlimited uploads</span>
            )}
          </div>
        </div>
      </div>

      {/* Credit Status Card */}
      <div className={`rounded-lg p-6 border-2 ${
        balance.hasProNFT 
          ? 'bg-gradient-to-r from-yellow-50 to-purple-50 border-yellow-200' 
          : balance.credits < 3 
            ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
            : 'bg-gradient-to-r from-blue-50 to-green-50 border-blue-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {balance.hasProNFT ? '♾️ Pro BeatNFT Status' : '🎫 BeatNFT Credits'}
            </h3>
            <p className="text-gray-600">
              {balance.hasProNFT 
                ? 'Upload unlimited beats in any format'
                : `${balance.credits} credits remaining • Upload costs: MP3 (1), WAV (2), ZIP (3-5)`
              }
            </p>
          </div>
          <div className="text-right">
            {!balance.hasProNFT && balance.credits < 3 && (
              <LinkComponent 
                href="/manage-subscription"
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-medium"
              >
                Buy More Credits
              </LinkComponent>
            )}
            {!balance.hasProNFT && balance.credits >= 3 && (
              <LinkComponent 
                href="/upload"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                Upload Beat
              </LinkComponent>
            )}
            {balance.hasProNFT && (
              <LinkComponent 
                href="/upload"
                className="bg-gradient-to-r from-purple-600 to-yellow-600 text-white px-4 py-2 rounded-md hover:from-purple-700 hover:to-yellow-700 text-sm font-medium"
              >
                Upload Beat
              </LinkComponent>
            )}
          </div>
        </div>
      </div>

      {/* Creator Negotiations - Phase 4E */}
      <CreatorNegotiationsCard />

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          {stats.recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-gray-600">No recent activity</p>
              <p className="text-sm text-gray-500 mt-2">Start uploading beats to see your activity here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-white p-2 rounded-full border">
                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.description}</p>
                    {activity.amount && (
                      <p className="text-sm text-gray-600">
                        {activity.type === 'credit_purchase' ? `${activity.amount} ETH` : `${activity.amount} credits`}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}