'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useSimpleAuth } from '@/context/SimpleAuthContext'
import SimpleSignIn from '@/components/SimpleSignIn'
import { useBeats } from '@/hooks/useBeats'
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics'
import { LinkComponent } from '@/components/LinkComponent'
import { Pagination } from '@/components/Pagination'
import BeatNFTAdminDashboard from '@/components/BeatNFTAdminDashboard'
import DashboardLayout from '@/components/DashboardLayout'
import MobileMetricCard from '@/components/MobileMetricCard'

// Phase 4E: Simple Creator Negotiations Overview
function CreatorNegotiationsOverview() {
  const [negotiations, setNegotiations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedNegotiations = JSON.parse(localStorage.getItem('pending_negotiations') || '[]')
    setNegotiations(storedNegotiations)
    setLoading(false)
  }, [])

  const platformRevenue = negotiations.reduce((total, neg) => total + (neg.proposedPrice * 0.15), 0)

  if (loading) return null

  return (
    <div className="bg-white rounded-lg shadow border mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">🤝 Creator Negotiations</h2>
          <span className="text-sm text-gray-600">
            Platform Revenue (15%): ${platformRevenue.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="p-6">
        {negotiations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎨</div>
            <p className="text-gray-600">No creator negotiations yet</p>
            <p className="text-sm text-gray-500">License negotiations will appear here when creators start negotiating</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {negotiations.slice(0, 6).map((negotiation, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-gray-900">BeatNFT™ #{negotiation.beatNftId}</p>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Pending</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{negotiation.creatorType} • {negotiation.creatorTier} tier</p>
                <div className="text-sm">
                  <p className="font-medium">${negotiation.proposedPrice}</p>
                  <p className="text-gray-500">Platform: ${(negotiation.proposedPrice * 0.15).toFixed(2)} (15%)</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AdminDashboard() {
  const { user, hasAnyRole } = useSimpleAuth()
  const { beats } = useBeats()
  const { analytics, loading: isLoading } = useAdminAnalytics()
  const [activityPage, setActivityPage] = useState(1)
  const [activityPerPage] = useState(5)
  
  const adminStats = {
    totalUsers: analytics.platformStats.totalUsers || 0,
    totalBeats: analytics.platformStats.totalBeats || 0,
    totalRevenue: parseFloat(analytics.platformStats.totalRevenue) || 0,
    pendingReviews: beats.filter(beat => beat.status === 'pending').length || 0,
    activeProducers: analytics.platformStats.totalUsers || 0,
    monthlyGrowth: 0
  }

  // Admin stats with fallback data
  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
        color: 'white',
        padding: '4rem 2rem',
        marginBottom: '2rem'
      }}>
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">🛡️ Admin Dashboard</h1>
            <p className="text-xl opacity-90 mb-6">Platform management and analytics for BeatsChain</p>
            <div className="flex justify-center gap-4 text-sm">
              <div className="bg-white/10 px-4 py-2 rounded-full">
                👥 {isLoading ? '...' : adminStats.totalUsers} Users
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-full">
                🎵 {isLoading ? '...' : adminStats.totalBeats} Beats
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-full">
                💰 R{isLoading ? '...' : adminStats.totalRevenue.toFixed(0)} Revenue
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        
        {/* BeatNFT Credit System Dashboard */}
        <BeatNFTAdminDashboard />

        {/* Phase 4E: Creator Negotiations Overview */}
        <CreatorNegotiationsOverview />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <MobileMetricCard
          title="Total Users"
          value={isLoading ? '...' : adminStats.totalUsers}
          icon="👥"
          color="blue"
          trend={{ value: adminStats.monthlyGrowth, label: 'this month' }}
          loading={isLoading}
        />
        
        <MobileMetricCard
          title="Total Beats"
          value={isLoading ? '...' : adminStats.totalBeats}
          icon="🎵"
          color="purple"
          loading={isLoading}
        />
        
        <MobileMetricCard
          title="Total Revenue"
          value={isLoading ? '...' : `R${adminStats.totalRevenue.toLocaleString()}`}
          icon="💰"
          color="green"
          loading={isLoading}
        />
        
        <MobileMetricCard
          title="Pending Reviews"
          value={isLoading ? '...' : adminStats.pendingReviews}
          icon="⚠️"
          color="yellow"
          loading={isLoading}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <LinkComponent href="/admin/users" className="block">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">User Management</h3>
                <p className="text-sm text-gray-600">Manage users, roles, and permissions</p>
              </div>
            </div>
          </div>
        </LinkComponent>

        <LinkComponent href="/admin/content" className="block">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Beat Moderation</h3>
                <p className="text-sm text-gray-600">Review and moderate beat uploads</p>
              </div>
            </div>
          </div>
        </LinkComponent>

        <LinkComponent href="/admin/analytics" className="block">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Platform Analytics</h3>
                <p className="text-sm text-gray-600">View detailed platform metrics</p>
              </div>
            </div>
          </div>
        </LinkComponent>

        <LinkComponent href="/admin/revenue" className="block">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Revenue Tracking</h3>
                <p className="text-sm text-gray-600">Monitor sales and commissions</p>
              </div>
            </div>
          </div>
        </LinkComponent>

        <LinkComponent href="/admin/blockchain" className="block">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-purple-600 text-xl">⛓️</span>
              </div>
              <div>
                <h3 className="font-semibold">Blockchain</h3>
                <p className="text-sm text-gray-600">Smart contract management</p>
              </div>
            </div>
          </div>
        </LinkComponent>

        <LinkComponent href="/admin/settings" className="block">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">System Settings</h3>
                <p className="text-sm text-gray-600">Configure platform settings</p>
              </div>
            </div>
          </div>
        </LinkComponent>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="p-6">
          {beats.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-gray-600">No recent activity</p>
              <p className="text-sm text-gray-500 mt-2">Activity will appear here as users interact with the platform</p>
            </div>
          ) : (
            <div className="space-y-4">
              {beats.slice((activityPage - 1) * activityPerPage, activityPage * activityPerPage).map((beat, index) => (
                <div key={beat.id || index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-full">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Beat uploaded</p>
                    <p className="text-sm text-gray-600">"{beat.title}" by {beat.producerId || 'Producer'}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {beat.createdAt ? new Date(beat.createdAt).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              ))}
              {beats.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No beats uploaded yet</p>
                </div>
              )}
            </div>
          )}
          <Pagination
            currentPage={activityPage}
            totalItems={beats.length}
            itemsPerPage={activityPerPage}
            onPageChange={setActivityPage}
          />
        </div>
      </div>


      </div>
    </div>
  )
}

export default function AdminPage() {
  const { hasAnyRole } = useSimpleAuth()
  
  return (
    hasAnyRole(['admin', 'super_admin']) ? (
      <DashboardLayout>
        <AdminDashboard />
      </DashboardLayout>
    ) : (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <SimpleSignIn />
        </div>
      </div>
    )
  )
}