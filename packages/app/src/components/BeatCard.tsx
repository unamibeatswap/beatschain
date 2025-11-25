'use client'

import { useState, useRef, useEffect } from 'react'
import { Beat } from '@/types/data'

interface BeatCardProps {
  beat: Beat & {
    createdAt: string
  }
  onPlay?: (beatId: string) => void
  onPurchase?: (beatId: string) => void
}

export default function BeatCard({ beat, onPlay, onPurchase }: BeatCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio || !beat.audioUrl) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        await audio.play()
        setIsPlaying(true)
        onPlay?.(beat.id)
      }
    } catch (error) {
      console.error('Audio play error:', error)
    }
  }

  const handlePurchase = () => {
    onPurchase?.(beat.id)
  }

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
            {beat.title}
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
            by {beat.producerName || 'Unknown Artist'} • {beat.genre}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#059669', margin: 0 }}>
            {beat.price} ETH
          </p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
            ~${(beat.price * 3500).toFixed(0)} USD
          </p>
        </div>
      </div>

      {/* Audio Player */}
      <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={togglePlay} style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '2.5rem',
            height: '2.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <div style={{ flex: 1, height: '6px', background: '#d1d5db', borderRadius: '3px' }}>
            <div style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`, height: '100%', background: '#3b82f6', borderRadius: '3px' }}></div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Beat Info */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span style={{
          background: '#f3f4f6',
          color: '#374151',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.25rem',
          fontSize: '0.75rem'
        }}>
          {beat.genre}
        </span>
        {beat.bpm && (
          <span style={{
            background: '#f3f4f6',
            color: '#374151',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem'
          }}>
            {beat.bpm} BPM
          </span>
        )}
        {(beat as any).isNFT && (
          <span style={{
            background: '#ddd6fe',
            color: '#7c3aed',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: '500'
          }}>
            NFT
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={handlePurchase}
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            flex: 1
          }}
        >
          Purchase Beat
        </button>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: '#f3f4f6',
            color: '#374151',
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          {showDetails ? 'Hide' : 'Details'}
        </button>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#f9fafb',
          borderRadius: '0.375rem',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Beat Details
          </h4>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.5' }}>
            <p><strong>ID:</strong> {beat.id}</p>
            <p><strong>Created:</strong> {new Date(beat.createdAt).toLocaleDateString()}</p>
            {(beat as any).tokenId && (
              <p><strong>Token ID:</strong> {(beat as any).tokenId}</p>
            )}
            {beat.bpm && (
              <p><strong>BPM:</strong> {beat.bpm}</p>
            )}
          </div>
        </div>
      )}

      {/* Hidden Audio Element */}
      {beat.audioUrl && (
        <audio
          ref={audioRef}
          src={beat.audioUrl}
          preload="metadata"
        />
      )}
    </div>
  )
}