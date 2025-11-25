'use client'

import { useState, useEffect, useMemo } from 'react'
import { Beat } from '@/types'
import { dataProvider } from '@/adapters/unifiedDataProvider'

interface UseOptimizedBeatsOptions {
  limit?: number
  genre?: string
  sortBy?: 'date' | 'price' | 'popularity'
  cacheTime?: number
}

export function useOptimizedBeats(options: UseOptimizedBeatsOptions = {}) {
  const { limit = 8, genre, sortBy = 'date', cacheTime = 300000 } = options
  const [beats, setBeats] = useState<Beat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cacheKey = useMemo(() => 
    `beats_${limit}_${genre || 'all'}_${sortBy}`, 
    [limit, genre, sortBy]
  )

  useEffect(() => {
    let mounted = true
    
    async function fetchBeats() {
      try {
        // Check cache first
        const cached = sessionStorage.getItem(cacheKey)
        const cacheTimestamp = sessionStorage.getItem(`${cacheKey}_timestamp`)
        
        if (cached && cacheTimestamp) {
          const age = Date.now() - parseInt(cacheTimestamp)
          if (age < cacheTime) {
            if (mounted) {
              setBeats(JSON.parse(cached))
              setLoading(false)
            }
            return
          }
        }

        // Fetch fresh data
        const freshBeats = await dataProvider.getFeaturedBeats(limit * 2)
        
        if (!mounted) return

        // Apply filters and sorting
        let filteredBeats = freshBeats
        
        if (genre) {
          filteredBeats = freshBeats.filter(beat => 
            beat.genre?.toLowerCase() === genre.toLowerCase()
          )
        }

        // Sort beats
        filteredBeats.sort((a, b) => {
          switch (sortBy) {
            case 'price':
              return (a.price || 0) - (b.price || 0)
            case 'popularity':
              return (b.plays || 0) - (a.plays || 0)
            case 'date':
            default:
              return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          }
        })

        const finalBeats = filteredBeats.slice(0, limit)
        
        // Cache results
        sessionStorage.setItem(cacheKey, JSON.stringify(finalBeats))
        sessionStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString())
        
        setBeats(finalBeats)
        setError(null)
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load beats')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchBeats()
    
    return () => {
      mounted = false
    }
  }, [cacheKey, limit, genre, sortBy, cacheTime])

  const refresh = () => {
    sessionStorage.removeItem(cacheKey)
    sessionStorage.removeItem(`${cacheKey}_timestamp`)
    setLoading(true)
    setError(null)
  }

  return { beats, loading, error, refresh }
}