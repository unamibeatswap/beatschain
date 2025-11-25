'use client'

import { useState, useEffect, useMemo } from 'react'
import { DecentralizedBeat } from '@/lib/metadata'

export interface SearchFilters {
  genre?: string
  minPrice?: number
  maxPrice?: number
  bpmRange?: [number, number]
  key?: string
  tags?: string[]
  producer?: string
}

export interface SearchOptions {
  sortBy: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'bpm' | 'relevance'
  limit?: number
}

export function useSearch(beats: DecentralizedBeat[]) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [options, setOptions] = useState<SearchOptions>({ sortBy: 'newest' })
  const [results, setResults] = useState<DecentralizedBeat[]>([])

  // Create search index for better performance
  const searchIndex = useMemo(() => {
    return beats.map(beat => ({
      ...beat,
      searchText: [
        beat.title,
        beat.description,
        beat.genre,
        beat.key,
        ...beat.tags,
        beat.producer
      ].join(' ').toLowerCase()
    }))
  }, [beats])

  // Perform search and filtering
  useEffect(() => {
    let filtered = [...searchIndex]

    // Text search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(beat => 
        beat.searchText.includes(term) ||
        beat.title.toLowerCase().includes(term) ||
        beat.genre.toLowerCase().includes(term)
      )
    }

    // Genre filter
    if (filters.genre) {
      filtered = filtered.filter(beat => beat.genre === filters.genre)
    }

    // Price range filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(beat => parseFloat(beat.price) >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(beat => parseFloat(beat.price) <= filters.maxPrice!)
    }

    // BPM range filter
    if (filters.bpmRange) {
      const [minBpm, maxBpm] = filters.bpmRange
      filtered = filtered.filter(beat => beat.bpm >= minBpm && beat.bpm <= maxBpm)
    }

    // Key filter
    if (filters.key) {
      filtered = filtered.filter(beat => beat.key === filters.key)
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(beat => 
        filters.tags!.some(tag => beat.tags.includes(tag))
      )
    }

    // Producer filter
    if (filters.producer) {
      filtered = filtered.filter(beat => beat.producer === filters.producer)
    }

    // Sort results
    switch (options.sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        break
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        break
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        break
      case 'bpm':
        filtered.sort((a, b) => a.bpm - b.bpm)
        break
      case 'relevance':
        // For relevance, prioritize exact title matches, then description matches
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase()
          filtered.sort((a, b) => {
            const aTitle = a.title.toLowerCase().includes(term) ? 1 : 0
            const bTitle = b.title.toLowerCase().includes(term) ? 1 : 0
            return bTitle - aTitle
          })
        }
        break
    }

    // Apply limit
    if (options.limit) {
      filtered = filtered.slice(0, options.limit)
    }

    setResults(filtered)
  }, [searchIndex, searchTerm, filters, options])

  // Get available filter options from current beats
  const filterOptions = useMemo(() => {
    const genres = Array.from(new Set(beats.map(b => b.genre))).filter(Boolean)
    const keys = Array.from(new Set(beats.map(b => b.key))).filter(Boolean)
    const tags = Array.from(new Set(beats.flatMap(b => b.tags))).filter(Boolean)
    const producers = Array.from(new Set(beats.map(b => b.producer))).filter(Boolean)
    
    const prices = beats.map(b => parseFloat(b.price)).filter(p => p > 0)
    const bpms = beats.map(b => b.bpm).filter(b => b > 0)
    
    return {
      genres: genres.sort(),
      keys: keys.sort(),
      tags: tags.sort(),
      producers: producers.sort(),
      priceRange: prices.length > 0 ? [Math.min(...prices), Math.max(...prices)] as [number, number] : [0, 0],
      bpmRange: bpms.length > 0 ? [Math.min(...bpms), Math.max(...bpms)] as [number, number] : [0, 0]
    }
  }, [beats])

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchTerm('')
  }

  const clearFilter = (key: keyof SearchFilters) => {
    setFilters(prev => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })
  }

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    updateFilter,
    clearFilter,
    clearFilters,
    options,
    setOptions,
    results,
    filterOptions,
    hasActiveFilters: Object.keys(filters).length > 0 || searchTerm.trim().length > 0
  }
}