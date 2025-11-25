'use client'

import { useState } from 'react'
import { useMarketplace } from '@/hooks/useMarketplace'
import { Beat } from '@/types'

interface MarketplaceModalProps {
  beat: Beat
  isOpen: boolean
  onClose: () => void
  mode: 'list' | 'buy'
}

export default function MarketplaceModal({ 
  beat, 
  isOpen, 
  onClose, 
  mode 
}: MarketplaceModalProps) {
  const { listBeatNFT, buyBeatNFT, createRoyaltyStream, loading } = useMarketplace()
  const [price, setPrice] = useState(beat.price || 100)
  const [royaltyShare, setRoyaltyShare] = useState(10)

  if (!isOpen) return null

  const handleList = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await listBeatNFT(beat.beatNftId || beat.id, price)
    if (success) onClose()
  }

  const handleBuy = async () => {
    const success = await buyBeatNFT(beat.beatNftId || beat.id, price)
    if (success) onClose()
  }

  const handleCreateRoyaltyStream = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await createRoyaltyStream(beat.beatNftId || beat.id, royaltyShare, price)
    if (success) onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'list' ? '🏪 List BeatNFT™' : '🛒 Buy BeatNFT™'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">{beat.title}</p>
            <p className="text-sm text-gray-600">BeatNFT™ #{beat.beatNftId || beat.id}</p>
            <p className="text-sm text-gray-600">Genre: {beat.genre}</p>
          </div>

          {mode === 'list' ? (
            <form onSubmit={handleList} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Price ($)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg text-sm">
                <p className="text-yellow-800">
                  <strong>Platform Fee:</strong> 15% will be deducted from sale
                </p>
                <p className="text-yellow-800">
                  <strong>You'll receive:</strong> ${(price * 0.85).toFixed(2)}
                </p>
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
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Listing...' : 'List for Sale'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-green-800 font-medium">Price: ${price}</p>
                <p className="text-green-700 text-sm">Includes full commercial rights</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuy}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Purchasing...' : 'Buy Now'}
                </button>
              </div>
            </div>
          )}

          {mode === 'list' && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium text-gray-900 mb-3">💰 Create Royalty Stream</h3>
              <form onSubmit={handleCreateRoyaltyStream} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Royalty Share (%)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={royaltyShare}
                    onChange={(e) => setRoyaltyShare(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>5%</span>
                    <span className="font-medium">{royaltyShare}%</span>
                    <span>50%</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 text-sm"
                >
                  {loading ? 'Creating...' : 'Create Royalty Stream'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}