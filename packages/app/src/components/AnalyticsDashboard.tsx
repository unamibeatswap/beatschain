'use client'

import { useAnalytics } from '@/hooks/useAnalytics'
import { useBehaviorAnalytics } from '@/hooks/useBehaviorAnalytics'
import { LoadingSpinner } from '@/components/LoadingStates'

export default function AnalyticsDashboard() {
  const { data, loading } = useAnalytics()
  const { analytics: behaviorData, loading: behaviorLoading } = useBehaviorAnalytics()

  if (loading || behaviorLoading) return <LoadingSpinner />

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {/* Beat Performance */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
          🎵 Beat Performance
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0369a1' }}>
              {data.beatPerformance.totalPlays.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Plays</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>
              {data.beatPerformance.totalSales}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Sales</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706' }}>
              {data.beatPerformance.totalRevenue.toFixed(3)} ETH
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Revenue</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#fdf2f8', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#be185d' }}>
              {data.beatPerformance.averagePrice.toFixed(3)} ETH
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Avg Price</div>
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
            📊 Popular Genres
          </h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {data.marketTrends.popularGenres.slice(0, 5).map(({ genre, count }) => (
              <div key={genre} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ textTransform: 'capitalize', color: '#374151' }}>{genre}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: `${Math.max(20, (count / Math.max(...data.marketTrends.popularGenres.map(g => g.count))) * 100)}px`,
                    height: '0.5rem',
                    background: '#3b82f6',
                    borderRadius: '0.25rem'
                  }}></div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', minWidth: '2rem' }}>{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
            💰 Price Distribution
          </h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {data.marketTrends.priceRanges.map(({ range, count }) => (
              <div key={range} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#374151' }}>{range}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: `${Math.max(20, (count / Math.max(...data.marketTrends.priceRanges.map(p => p.count))) * 100)}px`,
                    height: '0.5rem',
                    background: '#10b981',
                    borderRadius: '0.25rem'
                  }}></div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', minWidth: '2rem' }}>{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Behavior */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
          👥 User Behavior
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0369a1' }}>
              {data.userBehavior.conversionRate.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Conversion Rate</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>
              {Math.round(data.userBehavior.averageSessionTime)}s
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Avg Session</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706' }}>
              {data.userBehavior.bounceRate.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Bounce Rate</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#fdf2f8', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#be185d' }}>
              {data.userBehavior.returnVisitors}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Return Visitors</div>
          </div>
        </div>
      </div>

      {/* BeatNFT Credit System Effectiveness */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
          🎫 BeatNFT Credit System Performance
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0369a1' }}>
              {behaviorData.creditSystemEffectiveness.freeToProConversion.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Free to Pro BeatNFT</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>
              {behaviorData.creditSystemEffectiveness.creditUtilization.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Credit Utilization</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706' }}>
              {behaviorData.creditSystemEffectiveness.averageCreditsPerUser.toFixed(1)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Avg Credits/User</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#fdf2f8', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#be185d' }}>
              {behaviorData.engagement.returnVisitorRate.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Return Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}