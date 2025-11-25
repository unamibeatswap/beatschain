'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Beat } from '@/types/data'

interface AudioPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isLoading: boolean
  currentBeat?: Beat
}

export function useAudioPlayer(initialBeat?: Beat) {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isLoading: false,
    currentBeat: initialBeat
  })

  const audioRef = useRef<HTMLAudioElement>(null)

  const updateState = useCallback((updates: Partial<AudioPlayerState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const loadBeat = useCallback((beat: Beat) => {
    const audio = audioRef.current
    if (!audio) return

    // Stop current playback
    audio.pause()
    updateState({ 
      isPlaying: false, 
      currentTime: 0, 
      duration: 0,
      currentBeat: beat,
      isLoading: true 
    })

    // Load new beat
    audio.src = beat.audioUrl || ''
    audio.load()
  }, [updateState])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !state.currentBeat?.audioUrl) return

    if (state.isPlaying) {
      audio.pause()
      updateState({ isPlaying: false })
    } else {
      audio.play().catch(error => {
        console.warn('Audio play failed:', error)
        updateState({ isLoading: false })
      })
      updateState({ isPlaying: true })
    }
  }, [state.isPlaying, state.currentBeat, updateState])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = Math.max(0, Math.min(time, state.duration))
    updateState({ currentTime: audio.currentTime })
  }, [state.duration, updateState])

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = Math.max(0, Math.min(1, volume))
    audio.volume = newVolume
    updateState({ volume: newVolume })
  }, [updateState])

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, [])

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadStart = () => updateState({ isLoading: true })
    const handleCanPlay = () => updateState({ isLoading: false })
    const handleLoadedMetadata = () => updateState({ duration: audio.duration })
    const handleTimeUpdate = () => updateState({ currentTime: audio.currentTime })
    const handleEnded = () => updateState({ isPlaying: false, currentTime: 0 })
    const handleError = () => {
      console.warn('Audio loading error')
      updateState({ isLoading: false, isPlaying: false })
    }

    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [updateState])

  return {
    ...state,
    audioRef,
    loadBeat,
    togglePlay,
    seek,
    setVolume,
    formatTime
  }
}