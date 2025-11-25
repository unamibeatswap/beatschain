'use client'

import { useMarketAnalytics } from '@/hooks/useMarketAnalytics'
import { LoadingSpinner } from '@/components/LoadingStates'

export default function MarketInsights() {
  const { analytics, loading } = useMarketAnalytics()

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {/* Genre Trends */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
          📈 Genre Trends
        </h3>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {analytics.genreTrends.slice(0, 6).map(({ genre, growth, volume }) => (
            <div key={genre} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ textTransform: 'capitalize', fontWeight: '500', color: '#374151' }}>{genre}</span>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{volume} beats</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  color: growth > 0 ? '#10b981' : growth < -5 ? '#ef4444' : '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {growth > 0 ? '↗️' : growth < -5 ? '↘️' : '→'} {growth.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
            💰 Pricing Insights
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                {analytics.pricingInsights.averagePrice.toFixed(3)} ETH
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Market Average</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>
                {analytics.pricingInsights.sweetSpot.toFixed(3)} ETH
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sweet Spot</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
            📊 Conversion Benchmarks
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280' }}>Top Performers</span>
              <span style={{ fontWeight: '600', color: '#10b981' }}>{analytics.producerBenchmarks.conversionRates.high}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280' }}>Platform Average</span>
              <span style={{ fontWeight: '600', color: '#3b82f6' }}>{analytics.producerBenchmarks.conversionRates.average}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280' }}>Needs Improvement</span>
              <span style={{ fontWeight: '600', color: '#ef4444' }}>{analytics.producerBenchmarks.conversionRates.low}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Patterns */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
          🗓️ Seasonal Demand Patterns
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          {analytics.seasonalPatterns.map(({ period, demand }) => (
            <div key={period} style={{ textAlign: 'center', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0369a1' }}>
                {demand}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{period}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}