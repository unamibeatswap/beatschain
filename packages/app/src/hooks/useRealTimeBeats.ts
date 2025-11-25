'use client'

import { useState, useEffect } from 'react'
import { Beat } from '@/types'

export function useRealTimeBeats() {
  const [beats, setBeats] = useState<Beat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update play counts, likes, etc.
      setBeats(prev => prev.map(beat => ({
        ...beat,
        // Simulate random activity
        plays: (beat as any).plays ? (beat as any).plays + Math.floor(Math.random() * 3) : 0,
        likes: (beat as any).likes ? (beat as any).likes + Math.floor(Math.random() * 2) : 0
      })))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const addBeatRealTime = (newBeat: Beat) => {
    setBeats(prev => [newBeat, ...prev])
  }

  const updateBeatRealTime = (beatId: string, updates: Partial<Beat>) => {
    setBeats(prev => prev.map(beat => 
      beat.id === beatId ? { ...beat, ...updates } : beat
    ))
  }

  return {
    beats,
    loading,
    addBeatRealTime,
    updateBeatRealTime
  }
}