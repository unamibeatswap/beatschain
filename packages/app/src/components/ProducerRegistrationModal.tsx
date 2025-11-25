'use client'

import { useState } from 'react'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'

interface ProducerRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function ProducerRegistrationModal({ isOpen, onClose, onSuccess }: ProducerRegistrationModalProps) {
  const [formData, setFormData] = useState({
    stageName: '',
    bio: '',
    genres: '',
    experience: 'beginner'
  })
  const [submitting, setSubmitting] = useState(false)
  const { user, isAuthenticated } = useUnifiedAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.stageName.trim()) {
      alert('Please enter a stage name')
      return
    }
    
    if (!isAuthenticated || !user) {
      alert('Please connect your wallet first')
      return
    }

    setSubmitting(true)
    try {
      // Store producer profile
      const producerProfile = {
        ...formData,
        userId: user.address,
        isProducer: true,
        isVerified: false,
        onboardingCompleted: true,
        createdAt: new Date().toISOString()
      }
      
      localStorage.setItem(`producer_profile_${user.address}`, JSON.stringify(producerProfile))
      
      // Update user role
      const userData = JSON.parse(localStorage.getItem(`user_${user.address}`) || '{}')
      userData.role = 'producer'
      userData.isProducer = true
      userData.stageName = formData.stageName
      localStorage.setItem(`user_${user.address}`, JSON.stringify(userData))
      
      console.log('Producer registered:', producerProfile)
      onSuccess()
    } catch (error) {
      console.error('Producer registration failed:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">🎵 Producer Registration</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stage Name *</label>
              <input
                type="text"
                value={formData.stageName}
                onChange={(e) => setFormData({...formData, stageName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genres (comma separated)</label>
              <input
                type="text"
                value={formData.genres}
                onChange={(e) => setFormData({...formData, genres: e.target.value})}
                placeholder="hip-hop, trap, r&b"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner (0-1 years)</option>
                <option value="intermediate">Intermediate (2-5 years)</option>
                <option value="advanced">Advanced (5+ years)</option>
                <option value="professional">Professional</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !formData.stageName.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                onClick={handleSubmit}
              >
                {submitting ? 'Creating...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}