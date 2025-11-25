'use client'

import { useState, useEffect } from 'react'
import { web3ProfileService, Web3Profile } from '@/services/Web3ProfileService'

interface ProducerAvatarProps {
  address: string
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  className?: string
}

export default function ProducerAvatar({ 
  address, 
  size = 'md', 
  showName = false,
  className = '' 
}: ProducerAvatarProps) {
  const [profile, setProfile] = useState<Web3Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        const profileData = await web3ProfileService.getProfile(address)
        setProfile(profileData)
      } catch (error) {
        console.warn('Failed to load producer profile:', error)
      } finally {
        setLoading(false)
      }
    }

    if (address) {
      loadProfile()
    }
  }, [address])

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`${sizeClasses[size]} bg-gray-200 rounded-full animate-pulse`} />
        {showName && (
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
        )}
      </div>
    )
  }

  if (!profile) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`${sizeClasses[size]} bg-gray-300 rounded-full flex items-center justify-center text-gray-600`}>
          ?
        </div>
        {showName && (
          <span className={`${textSizeClasses[size]} text-gray-500`}>
            Unknown
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {profile.avatar?.startsWith('http') ? (
        <img
          src={profile.avatar}
          alt={profile.displayName || 'Producer'}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div className={`${sizeClasses[size]} ${profile.avatar || 'bg-gradient-to-r from-blue-400 to-purple-400'} rounded-full flex items-center justify-center text-white font-semibold`}>
          {profile.displayName?.charAt(0) || '🎵'}
        </div>
      )}
      
      {showName && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-medium text-gray-900`}>
            {profile.displayName || 'Unknown Producer'}
          </span>
          {profile.ensName && (
            <span className={`${textSizeClasses[size]} text-gray-500`}>
              {profile.ensName}
            </span>
          )}
        </div>
      )}
    </div>
  )
}