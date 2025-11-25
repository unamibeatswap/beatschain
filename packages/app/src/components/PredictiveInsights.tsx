'use client'

import { usePredictiveAnalytics } from '@/hooks/usePredictiveAnalytics'
import { LoadingSpinner } from '@/components/LoadingStates'

interface PredictiveInsightsProps {
  beatId?: string
}

export default function PredictiveInsights({ beatId }: PredictiveInsightsProps) {
  const { insights, loading } = usePredictiveAnalytics(beatId)

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {/* Price Optimization */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
          💰 AI Price Optimization
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Current Price</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151' }}>
                {insights.priceOptimization.currentPrice.toFixed(3)} ETH
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Suggested Price</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                {insights.priceOptimization.suggestedPrice.toFixed(3)} ETH
              </div>
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Expected Increase</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                +{insights.priceOptimization.expectedIncrease.toFixed(1)}%
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Confidence</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {insights.priceOptimization.confidence.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demand Forecast & Genre Trends */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
            📈 Demand Forecast
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Next Week</span>
              <span style={{ fontWeight: '600', color: '#10b981' }}>{insights.demandForecast.nextWeek} plays</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Next Month</span>
              <span style={{ fontWeight: '600', color: '#3b82f6' }}>{insights.demandForecast.nextMonth} plays</span>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Peak Days:</span>
              <div style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.25rem' }}>
                {insights.demandForecast.peakDays.join(', ')}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
            🎵 Genre Predictions
          </h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {insights.genreTrends.slice(0, 4).map(({ genre, predictedGrowth, recommendation }) => (
              <div key={genre} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#374151' }}>{genre}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: predictedGrowth > 0 ? '#10b981' : '#ef4444' 
                  }}>
                    {predictedGrowth > 0 ? '+' : ''}{predictedGrowth.toFixed(1)}%
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.125rem 0.375rem', 
                    borderRadius: '0.25rem',
                    background: recommendation === 'focus' ? '#dcfce7' : 
                               recommendation === 'diversify' ? '#fef3c7' : '#f3f4f6',
                    color: recommendation === 'focus' ? '#059669' : 
                           recommendation === 'diversify' ? '#d97706' : '#6b7280'
                  }}>
                    {recommendation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Projection */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
          💎 Revenue Projections
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
              {insights.revenueProjection.next30Days.toFixed(3)} ETH
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Next 30 Days</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0369a1' }}>
              {insights.revenueProjection.next90Days.toFixed(3)} ETH
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Next 90 Days</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>
              {insights.revenueProjection.yearEnd.toFixed(3)} ETH
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Year End</div>
          </div>
        </div>
      </div>
    </div>
  )
}