'use client'

import { useCreatorAnalytics } from '@/hooks/useCreatorAnalytics'
import { useContentCreator } from '@/hooks/useContentCreator'

export default function CreatorAnalyticsDashboard() {
  const { creator } = useContentCreator()
  const { analytics, loading, refreshAnalytics } = useCreatorAnalytics()

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">📊 Performance Analytics</h2>
          <button
            onClick={refreshAnalytics}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            🔄 Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{analytics.totalLicenses}</p>
            <p className="text-sm text-gray-600">Total Licenses</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">${analytics.totalSpent.toFixed(0)}</p>
            <p className="text-sm text-gray-600">Total Invested</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">${analytics.avgLicensePrice.toFixed(0)}</p>
            <p className="text-sm text-gray-600">Avg License Price</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{analytics.successRate.toFixed(0)}%</p>
            <p className="text-sm text-gray-600">Success Rate</p>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🤖 AI-Powered Recommendations</h3>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">💰 Pricing Strategy</h4>
            <p className="text-sm text-gray-700">{analytics.aiRecommendations.pricingStrategy}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">🎵 Recommended Genres</h4>
            <div className="flex flex-wrap gap-2">
              {analytics.aiRecommendations.genreTargets.map((genre) => (
                <span key={genre} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">⏰ Timing Optimization</h4>
            <p className="text-sm text-gray-700">{analytics.aiRecommendations.timingOptimization}</p>
          </div>
        </div>
      </div>

      {/* Platform Performance */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📱 Platform Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {creator?.platformConnections.youtube && (
            <div className="border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-red-500">📺</span>
                <span className="font-medium">YouTube</span>
              </div>
              <p className="text-sm text-gray-600">
                {analytics.platformPerformance.youtube.views.toLocaleString()} total views
              </p>
              <p className="text-sm text-gray-600">
                {analytics.platformPerformance.youtube.engagement.toFixed(1)}% engagement
              </p>
            </div>
          )}
          
          {creator?.platformConnections.tiktok && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-black">🎵</span>
                <span className="font-medium">TikTok</span>
              </div>
              <p className="text-sm text-gray-600">
                {analytics.platformPerformance.tiktok.views.toLocaleString()} total views
              </p>
              <p className="text-sm text-gray-600">
                {analytics.platformPerformance.tiktok.engagement.toFixed(1)}% engagement
              </p>
            </div>
          )}
          
          {creator?.platformConnections.patreon && (
            <div className="border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-orange-500">💰</span>
                <span className="font-medium">Patreon</span>
              </div>
              <p className="text-sm text-gray-600">
                ${analytics.platformPerformance.patreon.revenue}/month
              </p>
              <p className="text-sm text-gray-600">
                {analytics.platformPerformance.patreon.growth.toFixed(1)}% growth
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📈 6-Month Trend</h3>
        <div className="flex items-end space-x-2 h-32">
          {analytics.monthlyTrend.map((value, index) => (
            <div key={index} className="flex-1 bg-blue-200 rounded-t" style={{
              height: `${(value / Math.max(...analytics.monthlyTrend)) * 100}%`,
              minHeight: '20px'
            }}>
              <div className="text-xs text-center text-blue-800 mt-1">
                {value}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>6mo ago</span>
          <span>3mo ago</span>
          <span>Now</span>
        </div>
      </div>
    </div>
  )
}