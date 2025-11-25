'use client'

import { useProducerBeatAnalytics } from '@/hooks/useProducerBeatAnalytics'
import { LoadingSpinner } from '@/components/LoadingStates'
import { LinkComponent } from '@/components/LinkComponent'
import DashboardAudioPlayer from '@/components/DashboardAudioPlayer'

export default function ProducerBeatsList() {
  const { beatAnalytics, loading } = useProducerBeatAnalytics()

  if (loading) return <LoadingSpinner />

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
        🎵 Your Beat Performance
      </h2>
      
      {beatAnalytics.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎵</div>
          <p>No beats uploaded yet</p>
          <LinkComponent href="/upload" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
            Upload your first beat
          </LinkComponent>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {beatAnalytics.slice(0, 10).map((beat) => (
            <div key={beat.beatId} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <div className="w-64">
                <DashboardAudioPlayer 
                  beat={{
                    id: beat.beatId,
                    title: beat.title,
                    genre: beat.genre || 'Unknown',
                    bpm: beat.bpm || 120,
                    price: beat.price || 0.05,
                    producerId: beat.producerId || '',
                    coverImageUrl: beat.coverImageUrl || '',
                    audioUrl: beat.audioUrl || '',
                    isActive: true,
                    key: beat.key || 'C',
                    description: beat.description || ''
                  }}
                  variant="analytics"
                  showMetrics={true}
                  className="mb-0"
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: '#059669' }}>
                    {beat.revenue.toFixed(3)} ETH
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {beat.trend === 'up' && <span style={{ color: '#10b981' }}>↗️</span>}
                    {beat.trend === 'down' && <span style={{ color: '#ef4444' }}>↘️</span>}
                    {beat.trend === 'stable' && <span style={{ color: '#6b7280' }}>→</span>}
                    vs last week
                  </div>
                </div>
                
                <LinkComponent
                  href={`/beat/${beat.beatId}/analytics`}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  View Details
                </LinkComponent>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}