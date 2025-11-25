'use client'

import { useState } from 'react'
import BeatCard from './BeatCard'
import LoadingSpinner from './LoadingSpinner'
import { useOptimizedBeats } from '@/hooks/useOptimizedBeats'
import { useFeatureFlag } from '@/lib/featureFlags'

interface BeatGridProps {
  limit?: number
  genre?: string
  showFilters?: boolean
}

export default function BeatGrid({ 
  limit = 8, 
  genre, 
  showFilters = true 
}: BeatGridProps) {
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'popularity'>('date')
  const [selectedGenre, setSelectedGenre] = useState(genre || '')
  
  const { beats, loading, error, refresh } = useOptimizedBeats({
    limit,
    genre: selectedGenre,
    sortBy
  })
  
  const hybridMarketplace = useFeatureFlag('hybridMarketplace')

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '2rem' 
      }}>
        <LoadingSpinner size="lg" text="Loading beats..." />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem',
        color: '#ef4444'
      }}>
        <p>Failed to load beats: {error}</p>
        <button 
          onClick={refresh}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      {showFilters && (
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              background: 'white'
            }}
          >
            <option value="date">Latest</option>
            <option value="price">Price</option>
            <option value="popularity">Popular</option>
          </select>
          
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              background: 'white'
            }}
          >
            <option value="">All Genres</option>
            <option value="amapiano">Amapiano</option>
            <option value="gqom">Gqom</option>
            <option value="afrobeats">Afrobeats</option>
            <option value="hip-hop">Hip Hop</option>
          </select>

          {hybridMarketplace && (
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>🔗 {beats.filter(b => b.source === 'web3').length} Web3</span>
              <span>🎨 {beats.filter(b => b.source === 'sanity').length} Demo</span>
            </div>
          )}
        </div>
      )}

      {beats.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          color: '#6b7280'
        }}>
          <p>No beats found for the selected filters.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {beats.map((beat) => (
            <BeatCard key={beat.id} beat={beat} />
          ))}
        </div>
      )}
    </div>
  )
}