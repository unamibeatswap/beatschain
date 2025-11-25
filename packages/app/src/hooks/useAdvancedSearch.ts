'use client'

import { useState, useMemo } from 'react'
import { Beat } from '@/types'
import { useDebounce } from './useDebounce'

interface SearchFilters {
  query: string
  genre: string
  minPrice: number
  maxPrice: number
  bpmRange: [number, number]
  tags: string[]
}

export function useAdvancedSearch(beats: Beat[]) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    genre: 'all',
    minPrice: 0,
    maxPrice: 10,
    bpmRange: [60, 200],
    tags: []
  })

  const debouncedQuery = useDebounce(filters.query, 300)

  const filteredBeats = useMemo(() => {
    return beats.filter(beat => {
      // Text search
      const matchesQuery = !debouncedQuery || 
        beat.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        beat.genre.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        (beat.tags && beat.tags.some(tag => 
          tag.toLowerCase().includes(debouncedQuery.toLowerCase())
        ))

      // Genre filter
      const matchesGenre = filters.genre === 'all' || 
        beat.genre.toLowerCase() === filters.genre.toLowerCase()

      // Price range
      const matchesPrice = beat.price >= filters.minPrice && 
        beat.price <= filters.maxPrice

      // BPM range
      const matchesBPM = beat.bpm >= filters.bpmRange[0] && 
        beat.bpm <= filters.bpmRange[1]

      // Tags filter
      const matchesTags = filters.tags.length === 0 || 
        (beat.tags && filters.tags.every(tag => 
          beat.tags.some(beatTag => 
            beatTag.toLowerCase().includes(tag.toLowerCase())
          )
        ))

      return matchesQuery && matchesGenre && matchesPrice && matchesBPM && matchesTags
    })
  }, [beats, debouncedQuery, filters])

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      query: '',
      genre: 'all',
      minPrice: 0,
      maxPrice: 10,
      bpmRange: [60, 200],
      tags: []
    })
  }

  return {
    filters,
    filteredBeats,
    updateFilter,
    resetFilters,
    resultCount: filteredBeats.length
  }
}