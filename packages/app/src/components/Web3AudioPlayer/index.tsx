'use client'

import { useState, useRef, useEffect } from 'react'
import { Beat } from '@/types/data'
import ProducerAvatar from '@/components/ProducerAvatar'
import BeatSocialShare from '@/components/BeatSocialShare'
import BeatLink from '@/components/BeatLink'
import { usePurchase } from '@/context/PurchaseContext'

interface Web3AudioPlayerProps {
  beat: Beat
  autoPlay?: boolean
  showWaveform?: boolean
  className?: string
}

export default function Web3AudioPlayer({ 
  beat, 
  autoPlay = false, 
  showWaveform = false,
  className = '' 
}: Web3AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const { selectBeatForPurchase } = usePurchase()

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    const progress = progressRef.current
    if (!audio || !progress) return

    const rect = progress.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    
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
    <div className={`bg-white rounded-lg border shadow-sm overflow-hidden ${className}`}>
      <audio
        ref={audioRef}
        src={beat.audioUrl}
        preload="metadata"
        volume={volume}
      />
      
      {/* Beat Cover Image */}
      <div className="relative">
        {beat.coverImageUrl ? (
          <img 
            src={beat.coverImageUrl} 
            alt={beat.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-4xl">
            🎵
          </div>
        )}
        {beat.isNFT && (
          <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
            🎫 NFT
          </div>
        )}
      </div>
      
      {/* Beat Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <ProducerAvatar 
            address={beat.producerId} 
            size="sm" 
            showName={true}
          />
        </div>
        <div className="text-sm text-gray-500 mb-3">
          {beat.genre} • {beat.bpm} BPM • {beat.key}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={togglePlay}
            disabled={isLoading || !beat.audioUrl}
            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
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
            {/* Progress Bar */}
            <div 
              ref={progressRef}
              onClick={handleSeek}
              className="h-2 bg-gray-200 rounded-full cursor-pointer relative"
            >
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-100"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {/* Time Display */}
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value)
                setVolume(newVolume)
                if (audioRef.current) {
                  audioRef.current.volume = newVolume
                }
              }}
              className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Price & Purchase */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="text-green-600 font-semibold text-lg">{beat.price} ETH</span>
            <span className="text-gray-500 text-sm">~R{(beat.price * 18000).toFixed(0)}</span>
          </div>
          {beat.tags && beat.tags.length > 0 && (
            <div className="flex gap-1">
              {beat.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Beat Title Link */}
        <div className="mb-3">
          <BeatLink beat={beat}>
            <h3 className="font-semibold text-gray-900 text-lg mb-1 hover:text-blue-600 cursor-pointer transition-colors">
              {beat.title}
            </h3>
          </BeatLink>
        </div>
        
        {/* Social Share & Purchase */}
        <div className="flex justify-between items-center mb-3">
          <BeatSocialShare 
            beat={beat}
            size="sm"
            className="flex-shrink-0"
          />
          <BeatLink beat={beat}>
            <span className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">View Details →</span>
          </BeatLink>
        </div>
        
        <button 
          onClick={() => selectBeatForPurchase(beat)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
        >
          Purchase BeatNFT™
        </button>
      </div>
    </div>
  )
}