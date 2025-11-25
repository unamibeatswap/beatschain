'use client'

import { useState, useRef, useEffect } from 'react'
import { Beat } from '@/types/data'

interface AudioPlayerProps {
  beat: Beat
  autoPlay?: boolean
  showWaveform?: boolean
  previewMode?: boolean // 30-second preview
  allowFullAccess?: boolean // Override for beat owners
}

export default function AudioPlayer({ 
  beat, 
  autoPlay = false, 
  showWaveform = false,
  previewMode = false,
  allowFullAccess = false
}: AudioPlayerProps) {
  const [hasUsedCredit, setHasUsedCredit] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [canPlay, setCanPlay] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [audioSource, setAudioSource] = useState(beat.audioUrl)
  const [isLoading, setIsLoading] = useState(true)

  // Reset audio source when beat changes
  useEffect(() => {
    setAudioSource(beat.audioUrl)
    setRetryCount(0)
    setError(null)
  }, [beat.audioUrl])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)
    
    const handleCanPlay = () => {
      setCanPlay(true)
      setError(null)
      setIsLoading(false)
    }
    
    const handleLoadStart = () => {
      setIsLoading(true)
    }
    
    const handleError = () => {
      console.warn(`Audio error occurred (retry ${retryCount}/3):`, audioSource)
      setCanPlay(false)
      setIsPlaying(false)
      setIsLoading(false)
      
      // Implement retry logic with different strategies
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1)
        
        // Different retry strategies based on retry count
        if (retryCount === 0) {
          // First retry: Add cache-busting parameter
          const cacheBuster = `?cb=${Date.now()}`
          const newUrl = audioSource.includes('?') 
            ? `${audioSource}&cb=${Date.now()}` 
            : `${audioSource}${cacheBuster}`
          console.log('Retry strategy 1: Cache busting -', newUrl)
          setAudioSource(newUrl)
          setError('Retrying audio playback...')
        } 
        else if (retryCount === 1 && audioSource.includes('ipfs')) {
          // Second retry: Try alternative IPFS gateway if it's an IPFS URL
          const ipfsHash = audioSource.replace(/^ipfs:\/\/|^https?:\/\/[^/]+\/ipfs\//, '')
          const alternativeGateway = 'https://gateway.pinata.cloud/ipfs/'
          const newUrl = `${alternativeGateway}${ipfsHash}`
          console.log('Retry strategy 2: Alternative IPFS gateway -', newUrl)
          setAudioSource(newUrl)
          setError('Trying alternative source...')
        }
        else if (retryCount === 2 && beat.sanityAudioUrl) {
          // Third retry: Try Sanity fallback URL if available
          console.log('Retry strategy 3: Sanity fallback -', beat.sanityAudioUrl)
          setAudioSource(beat.sanityAudioUrl)
          setError('Switching to backup source...')
        }
        else {
          setError('Unable to play audio. Please try again later.')
        }
      } else {
        setError('Unable to play audio after multiple attempts.')
      }
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('loadstart', handleLoadStart)

    // Preview mode: stop at 30 seconds
    if (previewMode) {
      const checkPreviewLimit = () => {
        if (audio.currentTime >= 30) {
          audio.pause()
          setIsPlaying(false)
        }
      }
      audio.addEventListener('timeupdate', checkPreviewLimit)
    }

    // Set audio source
    audio.src = audioSource
    audio.load()

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('loadstart', handleLoadStart)
      if (previewMode) {
        audio.removeEventListener('timeupdate', checkPreviewLimit)
      }
    }
  }, [previewMode, audioSource, retryCount])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    // Access control placeholder for future implementation
    if (!previewMode && !allowFullAccess && !hasUsedCredit) {
      // Future: implement access control
      setHasUsedCredit(true)
    }

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        await audio.play()
        setIsPlaying(true)
      }
    } catch (err) {
      setError('Unable to play audio')
      setIsPlaying(false)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = parseFloat(e.target.value)
    audio.volume = newVolume
    setVolume(newVolume)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const maxTime = previewMode ? Math.min(duration, 30) : duration

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <audio
        ref={audioRef}
        preload="metadata"
        autoPlay={autoPlay}
      />

      {/* Beat Info */}
      <div className="flex items-center gap-3 mb-4">
        {beat.coverImageUrl && (
          <img
            src={beat.coverImageUrl}
            alt={beat.title}
            className="w-12 h-12 rounded object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{beat.title}</h3>
          <p className="text-sm text-gray-500">
            {beat.genre} • {beat.bpm} BPM • {beat.key}
          </p>
        </div>
        {previewMode && (
          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
            30s Preview
          </span>
        )}
        {!previewMode && !allowFullAccess && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Full Access
          </span>
        )}
      </div>

      {/* Waveform Placeholder */}
      {showWaveform && (
        <div className="mb-4 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded flex items-center justify-center">
          <div className="w-full h-4 bg-blue-200 bg-opacity-30 rounded relative">
            <div 
              className="absolute left-0 top-0 h-full bg-blue-500 rounded" 
              style={{ width: currentTime && maxTime ? `${(currentTime / maxTime) * 100}%` : '0%' }}
            ></div>
          </div>
        </div>
      )}

      {/* Loading and Error Messages */}
      {isLoading && (
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm flex items-center">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading audio...
        </div>
      )}
      {error && !isLoading && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Controls */}
      <div className="space-y-3">
        {/* Play/Pause & Time */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={maxTime || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="text-sm text-gray-500 min-w-0">
            {formatTime(currentTime)} / {formatTime(maxTime)}
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}