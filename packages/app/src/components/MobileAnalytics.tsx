'use client'

import { useAnalytics } from '@/hooks/useAnalytics'
import { LoadingSpinner } from '@/components/LoadingStates'

export default function MobileAnalytics() {
  const { data, loading } = useAnalytics()

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ display: 'grid', gap: '1rem', padding: '1rem' }}>
      {/* Key Metrics - Mobile Optimized */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0369a1' }}>
            {data.beatPerformance.totalPlays.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Plays</div>
        </div>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
            {data.beatPerformance.totalSales}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Sales</div>
        </div>
      </div>

      {/* Revenue & Conversion */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>
            {data.beatPerformance.totalRevenue.toFixed(3)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ETH Revenue</div>
        </div>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#be185d' }}>
            {data.userBehavior.conversionRate.toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Conversion</div>
        </div>
      </div>

      {/* Top Genres - Mobile */}
      <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>
          Top Genres
        </h4>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {data.marketTrends.popularGenres.slice(0, 3).map(({ genre, count }) => (
            <div key={genre} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: '#374151' }}>{genre}</span>
              <span style={{ color: '#6b7280' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}