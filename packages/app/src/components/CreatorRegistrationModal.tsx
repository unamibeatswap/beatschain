'use client'

import { useState } from 'react'
import { useContentCreator, CreatorRegistrationData } from '@/hooks/useContentCreator'
import { ContentCreator } from '@/types'
import ProfileImageUpload from './ProfileImageUpload'

interface CreatorRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function CreatorRegistrationModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: CreatorRegistrationModalProps) {
  const { registerCreator, loading } = useContentCreator()
  const [formData, setFormData] = useState<CreatorRegistrationData>({
    creatorType: 'youtuber',
    platformConnections: {},
    audienceSize: 0,
    profileImage: ''
  })

  const [currentStep, setCurrentStep] = useState(1)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const success = await registerCreator(formData)
    if (success) {
      onSuccess?.()
      onClose()
      setCurrentStep(1)
      setFormData({
        creatorType: 'youtuber',
        platformConnections: {},
        audienceSize: 0
      })
    }
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const updatePlatformConnection = (platform: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      platformConnections: {
        ...prev.platformConnections,
        [platform]: data
      }
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              🎨 Join as Content Creator
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of 3</span>
              <span className="text-sm text-gray-500">
                {currentStep === 1 && 'Creator Type'}
                {currentStep === 2 && 'Platform Connections'}
                {currentStep === 3 && 'Verification'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Creator Type */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What type of content do you create?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'youtuber', label: '📺 YouTuber', desc: 'Video content creator' },
                      { value: 'tiktoker', label: '🎵 TikToker', desc: 'Short-form video creator' },
                      { value: 'podcaster', label: '🎙️ Podcaster', desc: 'Audio content creator' },
                      { value: 'filmmaker', label: '🎬 Filmmaker', desc: 'Film & video producer' },
                      { value: 'gamedev', label: '🎮 Game Developer', desc: 'Video game creator' },
                      { value: 'streamer', label: '📡 Streamer', desc: 'Live content creator' }
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, creatorType: type.value as ContentCreator['creatorType'] }))}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          formData.creatorType === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Platform Connections */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Connect Your Platforms
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Connect your platforms to verify your audience and unlock higher creator tiers.
                  </p>
                </div>

                {/* YouTube Connection */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-500">📺</span>
                      <span className="font-medium">YouTube</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Channel ID"
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      onChange={(e) => updatePlatformConnection('youtube', {
                        ...formData.platformConnections.youtube,
                        channelId: e.target.value
                      })}
                    />
                    <input
                      type="number"
                      placeholder="Subscribers"
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      onChange={(e) => updatePlatformConnection('youtube', {
                        ...formData.platformConnections.youtube,
                        subscribers: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>

                {/* TikTok Connection */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-black">🎵</span>
                      <span className="font-medium">TikTok</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Username"
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      onChange={(e) => updatePlatformConnection('tiktok', {
                        ...formData.platformConnections.tiktok,
                        username: e.target.value
                      })}
                    />
                    <input
                      type="number"
                      placeholder="Followers"
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      onChange={(e) => updatePlatformConnection('tiktok', {
                        ...formData.platformConnections.tiktok,
                        followers: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>

                {/* Patreon Connection */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-500">💰</span>
                      <span className="font-medium">Patreon</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Tier Boost
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Creator ID"
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      onChange={(e) => updatePlatformConnection('patreon', {
                        ...formData.platformConnections.patreon,
                        creatorId: e.target.value
                      })}
                    />
                    <input
                      type="number"
                      placeholder="Subscribers"
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      onChange={(e) => updatePlatformConnection('patreon', {
                        ...formData.platformConnections.patreon,
                        subscribers: parseInt(e.target.value) || 0
                      })}
                    />
                    <input
                      type="number"
                      placeholder="Monthly Revenue ($)"
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      onChange={(e) => updatePlatformConnection('patreon', {
                        ...formData.platformConnections.patreon,
                        monthlyRevenue: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Verification */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Total Audience Size
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    What's your total audience size across all platforms?
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                    <ProfileImageUpload
                      currentImage={formData.profileImage}
                      onImageUpdate={(url) => setFormData(prev => ({ ...prev, profileImage: url }))}
                      size="lg"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="number"
                      placeholder="Total audience size"
                      value={formData.audienceSize || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        audienceSize: parseInt(e.target.value) || 0 
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      This helps us determine your creator tier and negotiation power
                    </p>
                  </div>
                </div>

                {/* Tier Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Creator Tiers:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>🥉 Bronze (0-10K)</span>
                      <span>Standard rates</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🥈 Silver (10K-100K)</span>
                      <span>+10% negotiation power</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🥇 Gold (100K-1M)</span>
                      <span>+25% negotiation power</span>
                    </div>
                    <div className="flex justify-between">
                      <span>💎 Platinum (1M+)</span>
                      <span>+50% negotiation power</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formData.audienceSize}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating Profile...' : '🎨 Create Creator Profile'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}