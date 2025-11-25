'use client'

import { useState, useEffect } from 'react'
import { useWeb3Data } from '@/context/Web3DataContext'
import { Beat } from '@/types'

export function useWeb3Beats() {
  const { beats, loading, error, refreshBeats } = useWeb3Data()
  const [filteredBeats, setFilteredBeats] = useState<Beat[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [genreFilter, setGenreFilter] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'price' | 'popular'>('newest')

  useEffect(() => {
    let filtered = [...beats]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(beat => 
        beat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beat.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beat.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Genre filter
    if (genreFilter) {
      filtered = filtered.filter(beat => beat.genre === genreFilter)
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'price':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'popular':
        // For now, sort by tokenId (lower = older = potentially more popular)
        filtered.sort((a, b) => (a.tokenId || 0) - (b.tokenId || 0))
        break
    }

    setFilteredBeats(filtered)
  }, [beats, searchTerm, genreFilter, sortBy])

  const genres = Array.from(new Set(beats.map(beat => beat.genre))).filter(Boolean)

  return {
    beats: filteredBeats,
    allBeats: beats,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    genreFilter,
    setGenreFilter,
    sortBy,
    setSortBy,
    genres,
    refreshBeats
  }
}