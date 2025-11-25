'use client'

import { useUserJourney } from '@/hooks/useUserJourney'
import { LoadingSpinner } from '@/components/LoadingStates'

export default function UserJourneyAnalytics() {
  const { journey, loading } = useUserJourney()

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {/* Discovery Patterns */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
          🔍 Beat Discovery Patterns
        </h3>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {journey.discoveryPatterns.map(({ source, users, conversionRate }) => (
            <div key={source} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '1rem', 
              background: '#f9fafb', 
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <div>
                <span style={{ fontWeight: '500', color: '#374151' }}>{source}</span>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{users} users</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: conversionRate > 10 ? '#10b981' : conversionRate > 7 ? '#3b82f6' : '#6b7280'
                }}>
                  {conversionRate.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>conversion</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Funnel */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
          📊 Conversion Funnel
        </h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {journey.conversionFunnel.map(({ step, users, dropRate }, index) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '120px', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                {step}
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: `${Math.max(20, (users / journey.conversionFunnel[0].users) * 300)}px`,
                  height: '2rem',
                  background: index === 0 ? '#10b981' : 
                             dropRate > 50 ? '#ef4444' : 
                             dropRate > 30 ? '#f59e0b' : '#3b82f6',
                  borderRadius: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {users}
                </div>
                {index > 0 && (
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: dropRate > 50 ? '#ef4444' : '#6b7280' 
                  }}>
                    -{dropRate}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retention & Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
            🔄 User Retention
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {journey.retentionCohorts.map(({ cohort, day1, day7, day30 }) => (
              <div key={cohort}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                  {cohort}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
                  <span style={{ color: '#10b981' }}>D1: {day1}%</span>
                  <span style={{ color: '#3b82f6' }}>D7: {day7}%</span>
                  <span style={{ color: '#8b5cf6' }}>D30: {day30}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
            🤖 AI Recommendations
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Click-through Rate</span>
              <span style={{ fontWeight: '600', color: '#10b981' }}>{journey.recommendationPerformance.clickThroughRate}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Conversion Rate</span>
              <span style={{ fontWeight: '600', color: '#3b82f6' }}>{journey.recommendationPerformance.conversionRate}%</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Top Performing Genres:
            </div>
            {journey.recommendationPerformance.topGenres.map(({ genre, ctr }) => (
              <div key={genre} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#6b7280' }}>{genre}</span>
                <span style={{ color: '#374151' }}>{ctr}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}