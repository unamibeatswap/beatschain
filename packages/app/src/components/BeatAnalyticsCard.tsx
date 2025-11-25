'use client'

import { useBeatAnalytics } from '@/hooks/useBeatAnalytics'
import { LoadingSpinner } from '@/components/LoadingStates'

interface BeatAnalyticsCardProps {
  beatId: string
  compact?: boolean
}

export default function BeatAnalyticsCard({ beatId, compact = false }: BeatAnalyticsCardProps) {
  const { analytics, loading } = useBeatAnalytics(beatId)

  if (loading) return <LoadingSpinner />
  if (!analytics) return <div>No analytics available</div>

  if (compact) {
    return (
      <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
          {analytics.title}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
          <div>
            <span style={{ color: '#6b7280' }}>Plays:</span> {analytics.plays.toLocaleString()}
          </div>
          <div>
            <span style={{ color: '#6b7280' }}>Sales:</span> {analytics.sales}
          </div>
          <div>
            <span style={{ color: '#6b7280' }}>Revenue:</span> {analytics.revenue.toFixed(3)} ETH
          </div>
          <div>
            <span style={{ color: '#6b7280' }}>Conv:</span> {analytics.conversionRate.toFixed(1)}%
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
        📊 {analytics.title} - Performance
      </h3>
      
      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0369a1' }}>
            {analytics.plays.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Plays</div>
        </div>
        <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
            {analytics.sales}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sales</div>
        </div>
        <div style={{ textAlign: 'center', padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>
            {analytics.revenue.toFixed(3)} ETH
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Revenue</div>
        </div>
        <div style={{ textAlign: 'center', padding: '1rem', background: '#fdf2f8', borderRadius: '0.5rem' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#be185d' }}>
            {analytics.conversionRate.toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Conversion</div>
        </div>
      </div>

      {/* Geographic Data */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
          🌍 Geographic Distribution
        </h4>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {analytics.geographicData.map(({ country, plays }) => (
            <div key={country} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#374151' }}>{country}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: `${Math.max(20, (plays / Math.max(...analytics.geographicData.map(g => g.plays))) * 100)}px`,
                  height: '0.5rem',
                  background: '#3b82f6',
                  borderRadius: '0.25rem'
                }}></div>
                <span style={{ fontSize: '0.875rem', color: '#6b7280', minWidth: '3rem' }}>
                  {plays.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement */}
      <div>
        <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
          💫 Engagement
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '0.75rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151' }}>
              {analytics.engagement.likes}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Likes</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.75rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151' }}>
              {analytics.engagement.shares}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Shares</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.75rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151' }}>
              {analytics.engagement.downloads}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Downloads</div>
          </div>
        </div>
      </div>
    </div>
  )
}