'use client'

import { useState, useEffect } from 'react'
import { supabaseBeats } from '@/lib/supabase.enhanced'
import { useRealtimeAnalytics } from '@/hooks/useRealtimeAnalytics'

interface LivepeerAnalyticsDashboardProps {
  beats: any[]
}

export default function LivepeerAnalyticsDashboard({ beats }: LivepeerAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { metrics: realtimeMetrics } = useRealtimeAnalytics()

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await supabaseBeats.getAnalytics()
        setAnalytics(data)
      } catch (error) {
        console.warn('Analytics fetch failed:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
    const interval = setInterval(loadAnalytics, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div style={{
        background: '#f8fafc',
        borderRadius: '0.5rem',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
        <p style={{ color: '#6b7280', margin: 0 }}>Loading live analytics...</p>
      </div>
    )
  }

  const optimizedBeats = beats.filter(b => (b as any).optimizedPlayback).length
  const optimizationRate = beats.length > 0 ? (optimizedBeats / beats.length * 100) : 0
  const totalPlays = analytics?.totalPlays || 0
  const optimizedPlays = analytics?.optimizedPlays || 0
  const playOptimizationRate = totalPlays > 0 ? (optimizedPlays / totalPlays * 100) : 0

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '0.5rem',
      padding: '2rem',
      color: 'white',
      marginBottom: '2rem'
    }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', textAlign: 'center' }}>
        🚀 Livepeer-Powered Analytics
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {totalPlays.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Plays</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {playOptimizationRate.toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>⚡ Optimized Plays</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {optimizedBeats}
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>🎵 Livepeer Beats</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {beats.length}
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>📊 Total Beats</div>
        </div>
      </div>
      
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '0.375rem',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '0.875rem', margin: 0, opacity: 0.9 }}>
          🎯 {optimizationRate.toFixed(1)}% of beats use Livepeer optimization • 
          {playOptimizationRate.toFixed(1)}% faster streaming experience
        </p>
      </div>
    </div>
  )
}