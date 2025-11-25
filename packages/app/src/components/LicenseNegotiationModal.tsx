'use client'

import { useState } from 'react'
import { useContentCreator } from '@/hooks/useContentCreator'
import { useCreatorLicensing } from '@/hooks/useCreatorLicensing'
import { Beat } from '@/types'

interface LicenseNegotiationModalProps {
  beat: Beat
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function LicenseNegotiationModal({ 
  beat, 
  isOpen, 
  onClose, 
  onSuccess 
}: LicenseNegotiationModalProps) {
  const { creator } = useContentCreator()
  const { createNegotiation, loading } = useCreatorLicensing()
  const [proposedPrice, setProposedPrice] = useState(beat.price || 100)
  const [creatorRoyalty, setCreatorRoyalty] = useState(25)
  const [message, setMessage] = useState('')
  const [useSmartContract, setUseSmartContract] = useState(true)

  if (!isOpen) return null

  const producerShare = 100 - creatorRoyalty - 15 // 15% platform fee
  const platformFee = proposedPrice * 0.15
  const creatorAmount = proposedPrice * (creatorRoyalty / 100)
  const producerAmount = proposedPrice * (producerShare / 100)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (useSmartContract) {
      const success = await createNegotiation(
        beat.beatNftId || beat.id,
        beat.producerId,
        proposedPrice,
        creatorRoyalty,
        message
      )
      
      if (success) {
        onSuccess?.()
        onClose()
      }
    } else {
      onSuccess?.()
      onClose()
    }
  }

  const getTierMultiplier = () => {
    switch (creator?.verificationTier) {
      case 'platinum': return 1.5
      case 'gold': return 1.25
      case 'silver': return 1.1
      default: return 1.0
    }
  }

  const suggestedRoyalty = Math.min(Math.floor(25 * getTierMultiplier()), 45)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              🤝 License Negotiation
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">{beat.title}</p>
            <p className="text-sm text-gray-600">BeatNFT™ #{beat.beatNftId || beat.id}</p>
            <p className="text-sm text-gray-600">Original Price: ${beat.price}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proposed Price ($)
              </label>
              <input
                type="number"
                value={proposedPrice}
                onChange={(e) => setProposedPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Royalty Share (%)
                {creator?.verificationTier !== 'bronze' && (
                  <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    Suggested: {suggestedRoyalty}% ({creator?.verificationTier} tier)
                  </span>
                )}
              </label>
              <input
                type="range"
                min="10"
                max="45"
                value={creatorRoyalty}
                onChange={(e) => setCreatorRoyalty(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10%</span>
                <span className="font-medium">{creatorRoyalty}%</span>
                <span>45%</span>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <h4 className="font-medium text-blue-900 mb-2">Revenue Breakdown</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Producer ({producerShare}%)</span>
                  <span className="font-medium">${producerAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Creator ({creatorRoyalty}%)</span>
                  <span className="font-medium">${creatorAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span>Platform Fee (15%)</span>
                  <span className="font-medium">${platformFee.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to Producer (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Explain your use case, audience size, etc."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Offer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}