/**
 * Web3 Beats Bridge Hook
 * Enables cross-profile beat sharing while maintaining localStorage isolation
 */

import { useState, useEffect } from 'react'
import { Beat } from '@/types'
import { communityBeatsCache } from '@/services/communityBeatsCache'

interface Web3BeatsBridge {
  communityBeats: Beat[]
  localBeats: Beat[]
  allBeats: Beat[]
  loading: boolean
  refreshCommunity: () => Promise<void>
}

export function useWeb3BeatsBridge(): Web3BeatsBridge {
  const [communityBeats, setCommunityBeats] = useState<Beat[]>([])
  const [localBeats, setLocalBeats] = useState<Beat[]>([])
  const [loading, setLoading] = useState(true)

  const loadLocalBeats = () => {
    if (typeof window === 'undefined') return []
    
    try {
      const beats: Beat[] = []
      
      // Get beats from Web3DataContext
      const contextData = (window as any).__WEB3_DATA_CONTEXT__
      if (contextData && contextData.beats) {
        beats.push(...contextData.beats)
      }
      
      // Get beats from localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('producer_beats_') || key?.startsWith('uploaded_beat_')) {
          try {
            const data = localStorage.getItem(key)
            if (data) {
              const parsed = JSON.parse(data)
              if (Array.isArray(parsed)) {
                beats.push(...parsed)
              } else if (parsed.id) {
                beats.push(parsed)
              }
            }
          } catch (error) {
            console.warn(`Error parsing localStorage key ${key}:`, error)
          }
        }
      }
      
      // Remove duplicates
      const uniqueBeats = beats.filter((beat, index, self) => 
        self.findIndex(b => b.id === beat.id) === index
      )
      
      return uniqueBeats
    } catch (error) {
      console.warn('Error loading local beats:', error)
      return []
    }
  }

  const loadCommunityBeats = async () => {
    try {
      const beats = await communityBeatsCache.getBeats()
      
      // Convert to Beat format
      const convertedBeats: Beat[] = beats.map(beat => ({
        id: beat.id,
        title: beat.title,
        description: '',
        genre: '',
        bpm: 120,
        price: 0,
        producerId: beat.producerId,
        coverImageUrl: '',
        audioUrl: '',
        isActive: beat.isActive,
        createdAt: new Date(beat.discoveredAt),
        updatedAt: new Date(beat.discoveredAt),
        source: 'community'
      }))
      
      return convertedBeats
    } catch (error) {
      console.warn('Error loading community beats:', error)
      return []
    }
  }

  const refreshCommunity = async () => {
    setLoading(true)
    try {
      const [community, local] = await Promise.all([
        loadCommunityBeats(),
        Promise.resolve(loadLocalBeats())
      ])
      
      setCommunityBeats(community)
      setLocalBeats(local)
    } catch (error) {
      console.error('Error refreshing beats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshCommunity()
    
    // Refresh every 5 minutes
    const interval = setInterval(refreshCommunity, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  // Combine beats with local priority
  const allBeats = [
    ...localBeats.map(beat => ({ ...beat, priority: 1 })),
    ...communityBeats
      .filter(beat => !localBeats.some(local => local.id === beat.id))
      .map(beat => ({ ...beat, priority: 2 }))
  ].sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return {
    communityBeats,
    localBeats,
    allBeats,
    loading,
    refreshCommunity
  }
}