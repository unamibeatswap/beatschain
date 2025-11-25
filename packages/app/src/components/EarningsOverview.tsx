'use client'

import { useState, useEffect } from 'react'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'

export default function EarningsOverview() {
  const { user } = useUnifiedAuth()
  const [earnings, setEarnings] = useState({
    total: 0,
    thisMonth: 0,
    totalSales: 0,
    avgPrice: 0
  })

  useEffect(() => {
    if (user?.address) {
      // Calculate from beats data
      const beatsData = localStorage.getItem(`producer_beats_${user.address}`)
      if (beatsData) {
        const beats = JSON.parse(beatsData)
        const totalBeats = beats.length
        const avgPrice = totalBeats > 0 ? beats.reduce((sum: number, beat: any) => sum + beat.price, 0) / totalBeats : 0
        
        // Mock sales data (in real app, this would come from blockchain events)
        const mockSales = Math.floor(totalBeats * 0.3) // 30% of beats sold
        const mockEarnings = mockSales * avgPrice * 0.85 // 85% after platform fee
        
        setEarnings({
          total: mockEarnings,
          thisMonth: mockEarnings * 0.2, // 20% this month
          totalSales: mockSales,
          avgPrice
        })
      }
    }
  }, [user?.address])

  const stats = [
    {
      label: 'Total Earnings',
      value: `${earnings.total.toFixed(3)} ETH`,
      subValue: `~$${Math.round(earnings.total * 2400)}`,
      icon: '💰',
      color: 'text-green-600'
    },
    {
      label: 'This Month',
      value: `${earnings.thisMonth.toFixed(3)} ETH`,
      subValue: `~$${Math.round(earnings.thisMonth * 2400)}`,
      icon: '📈',
      color: 'text-blue-600'
    },
    {
      label: 'Total Sales',
      value: earnings.totalSales.toString(),
      subValue: 'beats sold',
      icon: '🎵',
      color: 'text-purple-600'
    },
    {
      label: 'Avg Price',
      value: `${earnings.avgPrice.toFixed(3)} ETH`,
      subValue: 'per beat',
      icon: '💎',
      color: 'text-indigo-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">{stat.icon}</div>
            <div className={`text-sm font-medium ${stat.color}`}>
              {stat.label}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.subValue}</div>
          </div>
        </div>
      ))}
    </div>
  )
}