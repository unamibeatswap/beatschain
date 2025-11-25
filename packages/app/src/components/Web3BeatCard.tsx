'use client'

import { useState } from 'react'
import { Beat } from '@/types'
import AudioPlayer from './audio/AudioPlayer'
import PurchaseModal from './purchase/PurchaseModal'

interface Web3BeatCardProps {
  beat: Beat
}

export default function Web3BeatCard({ beat }: Web3BeatCardProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  const formatPrice = (price: number) => {
    return `${price.toFixed(4)} ETH`
  }

  const handlePurchaseComplete = (beatId: string, licenseType: string) => {
    console.log('Purchase completed:', { beatId, licenseType })
    setShowPurchaseModal(false)
    // Handle successful purchase
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Cover Image */}
        <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
          {beat.coverImageUrl ? (
            <img
              src={beat.coverImageUrl}
              alt={beat.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white text-4xl">🎵</span>
            </div>
          )}
          
          {/* NFT Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              NFT #{beat.tokenId}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title & Producer */}
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
              {beat.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {beat.producerId.slice(0, 6)}...{beat.producerId.slice(-4)}
            </p>
          </div>

          {/* Beat Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
              {beat.genre}
            </span>
            <span>{beat.bpm} BPM</span>
            <span>{beat.key}</span>
          </div>

          {/* Tags */}
          {beat.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {beat.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {beat.tags.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{beat.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Audio Player */}
          <div className="mb-4">
            <AudioPlayer beat={beat} previewMode={true} />
          </div>

          {/* Price & Purchase */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(beat.price)}
              </p>
              <p className="text-sm text-gray-500">Starting price</p>
            </div>
            
            <button
              onClick={() => setShowPurchaseModal(true)}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
            >
              Purchase
            </button>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <PurchaseModal
          beat={beat}
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          onPurchaseComplete={handlePurchaseComplete}
        />
      )}
    </>
  )
}