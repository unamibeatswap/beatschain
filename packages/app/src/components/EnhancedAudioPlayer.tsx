'use client'

import { useState, useRef, useEffect } from 'react'
import { LivepeerAsset } from '@/lib/livepeer'

interface EnhancedAudioPlayerProps {
  src: string
  livepeerAsset?: LivepeerAsset
  title?: string
  artist?: string
  coverImage?: string
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
}

export default function EnhancedAudioPlayer({
  src,
  livepeerAsset,
  title,
  artist,
  coverImage,
  onPlay,
  onPause,
  onEnded
}: EnhancedAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const isOptimized = livepeerAsset && !livepeerAsset.mocked && livepeerAsset.playbackUrl

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadStart = () => setLoading(true)
    const handleCanPlay = () => setLoading(false)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handlePlay = () => {
      setIsPlaying(true)
      onPlay?.()
    }
    const handlePause = () => {
      setIsPlaying(false)
      onPause?.()
    }
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      onEnded?.()
    }

    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [onPlay, onPause, onEnded])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (parseFloat(e.target.value) / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div style={{
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      {/* Cover Image */}
      {coverImage && (
        <img
          src={coverImage}
          alt={title || 'Beat cover'}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '0.375rem',
            objectFit: 'cover'
          }}
        />
      )}

      {/* Player Controls */}
      <div style={{ flex: 1 }}>
        {/* Track Info */}
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', margin: 0 }}>
                {title || 'Untitled Beat'}
              </h4>
              {artist && (
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                  by {artist}
                </p>
              )}
            </div>
            {isOptimized && (
              <div style={{
                background: '#10b981',
                color: 'white',
                padding: '0.125rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                ⚡ Optimized
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={togglePlay}
            disabled={loading}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '⏳' : isPlaying ? '⏸️' : '▶️'}
          </button>

          {/* Progress Bar */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#6b7280', minWidth: '35px' }}>
              {formatTime(currentTime)}
            </span>
            
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercentage}
                onChange={handleSeek}
                style={{
                  width: '100%',
                  height: '4px',
                  background: '#e5e7eb',
                  borderRadius: '2px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
            </div>
            
            <span style={{ fontSize: '0.75rem', color: '#6b7280', minWidth: '35px' }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        style={{ display: 'none' }}
      />
    </div>
  )
}