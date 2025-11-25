'use client'

import { useState, useEffect } from 'react'
import { useBeatNFT } from '@/hooks/useBeatNFT'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'
import { toast } from 'react-toastify'

interface CreditStats {
  totalCreditsIssued: number
  totalCreditsUsed: number
  activeUsers: number
  proBeatNFTHolders: number
  revenueGenerated: number
  averageCreditsPerUser: number
}

export default function BeatNFTAdminDashboard() {
  const { user, hasAnyRole } = useUnifiedAuth()
  const [stats, setStats] = useState<CreditStats>({
    totalCreditsIssued: 0,
    totalCreditsUsed: 0,
    activeUsers: 0,
    proBeatNFTHolders: 0,
    revenueGenerated: 0,
    averageCreditsPerUser: 0
  })
  const [loading, setLoading] = useState(true)
  const [marketingCredits, setMarketingCredits] = useState(100)
  const [targetWallet, setTargetWallet] = useState('')

  // Only show for admin/super_admin
  if (!hasAnyRole(['admin', 'super_admin'])) {
    return null
  }

  useEffect(() => {
    loadCreditStats()
    const interval = setInterval(loadCreditStats, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadCreditStats = async () => {
    if (typeof window === 'undefined') return
    
    try {
      setLoading(true)
      
      // Aggregate data from localStorage (temporary until blockchain integration)
      const allKeys = Object.keys(localStorage).filter(key => key.startsWith('beatnft_balance_'))
      let totalIssued = 0
      let totalUsed = 0
      let activeUsers = 0
      let proHolders = 0
      let revenue = 0

      allKeys.forEach(key => {
        try {
          const balance = JSON.parse(localStorage.getItem(key) || '{}')
          if (balance.credits !== undefined) {
            totalIssued += (balance.credits + balance.totalUsed)
            totalUsed += balance.totalUsed
            activeUsers++
            if (balance.hasProNFT) {
              proHolders++
              revenue += 0.1 * 18000 // 0.1 ETH * R18,000 per ETH
            }
          }
        } catch (e) {
          console.warn('Invalid balance data:', key)
        }
      })

      // Add marketing credits issued
      const marketingIssued = parseInt(localStorage.getItem('marketing_credits_issued') || '0')
      totalIssued += marketingIssued

      setStats({
        totalCreditsIssued: totalIssued,
        totalCreditsUsed: totalUsed,
        activeUsers,
        proBeatNFTHolders: proHolders,
        revenueGenerated: revenue,
        averageCreditsPerUser: activeUsers > 0 ? Math.round(totalIssued / activeUsers) : 0
      })
    } catch (error) {
      console.error('Error loading credit stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const issueMarketingCredits = async () => {
    if (!targetWallet || marketingCredits <= 0 || typeof window === 'undefined') {
      toast.error('Please enter valid wallet address and credit amount')
      return
    }

    try {
      const balanceKey = `beatnft_balance_${targetWallet.toLowerCase()}`
      const existingBalance = JSON.parse(localStorage.getItem(balanceKey) || '{"credits": 10, "hasProNFT": false, "totalUsed": 0}')
      
      const newBalance = {
        ...existingBalance,
        credits: existingBalance.credits + marketingCredits
      }
      
      localStorage.setItem(balanceKey, JSON.stringify(newBalance))
      
      // Track marketing credits issued
      const currentMarketing = parseInt(localStorage.getItem('marketing_credits_issued') || '0')
      localStorage.setItem('marketing_credits_issued', (currentMarketing + marketingCredits).toString())
      
      toast.success(`✅ Issued ${marketingCredits} marketing credits to ${targetWallet.slice(0, 6)}...${targetWallet.slice(-4)}`)
      
      // Reset form
      setTargetWallet('')
      setMarketingCredits(100)
      
      // Refresh stats
      loadCreditStats()
      
    } catch (error) {
      console.error('Error issuing marketing credits:', error)
      toast.error('Failed to issue marketing credits')
    }
  }

  const calculateFinancialImpact = () => {
    const freeCreditsValue = stats.totalCreditsIssued * 0.001 * 18000 // 0.001 ETH per credit * R18,000
    const actualRevenue = stats.revenueGenerated
    const potentialLoss = freeCreditsValue - actualRevenue
    
    return {
      freeCreditsValue: Math.round(freeCreditsValue),
      actualRevenue: Math.round(actualRevenue),
      potentialLoss: Math.round(potentialLoss),
      conversionRate: stats.totalCreditsIssued > 0 ? ((stats.proBeatNFTHolders / stats.activeUsers) * 100).toFixed(1) : '0'
    }
  }

  const impact = calculateFinancialImpact()

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">🎫 BeatNFT Credit System</h2>
        <button
          onClick={loadCreditStats}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '🔄 Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Real-time Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Credits Issued</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalCreditsIssued.toLocaleString()}</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-full">
              <span className="text-2xl">🎫</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Credits Used</p>
              <p className="text-2xl font-bold text-green-900">{stats.totalCreditsUsed.toLocaleString()}</p>
            </div>
            <div className="bg-green-200 p-3 rounded-full">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Active Users</p>
              <p className="text-2xl font-bold text-purple-900">{stats.activeUsers}</p>
            </div>
            <div className="bg-purple-200 p-3 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Pro BeatNFT Holders</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.proBeatNFTHolders}</p>
            </div>
            <div className="bg-yellow-200 p-3 rounded-full">
              <span className="text-2xl">♾️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Impact Analysis */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-red-900 mb-4">💰 Financial Impact Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-red-700">Free Credits Value</p>
            <p className="text-xl font-bold text-red-900">R{impact.freeCreditsValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-green-700">Actual Revenue</p>
            <p className="text-xl font-bold text-green-900">R{impact.actualRevenue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-orange-700">Potential Loss</p>
            <p className="text-xl font-bold text-orange-900">R{impact.potentialLoss.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-blue-700">Conversion Rate</p>
            <p className="text-xl font-bold text-blue-900">{impact.conversionRate}%</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-white rounded border">
          <p className="text-sm text-gray-600">
            <strong>Business Model Impact:</strong> Each free credit costs ~R18 in potential revenue. 
            Current conversion rate to Pro BeatNFT is {impact.conversionRate}%. 
            Consider limiting free credits or implementing credit expiry to improve conversion.
          </p>
        </div>
      </div>

      {/* Marketing Credit Issuance */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎁 Issue Marketing Credits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Wallet Address
            </label>
            <input
              type="text"
              value={targetWallet}
              onChange={(e) => setTargetWallet(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credits to Issue
            </label>
            <input
              type="number"
              value={marketingCredits}
              onChange={(e) => setMarketingCredits(parseInt(e.target.value) || 0)}
              min="1"
              max="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={issueMarketingCredits}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md hover:from-green-700 hover:to-blue-700 font-medium"
            >
              Issue Credits
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          ⚠️ Marketing credits impact platform economics. Value: R{(marketingCredits * 18).toLocaleString()} potential revenue.
        </p>
      </div>
    </div>
  )
}