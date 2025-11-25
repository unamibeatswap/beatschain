'use client'

import { useState } from 'react'
import { BeatNFTLicense } from '@/types'

interface CreatorLicenseCardProps {
  license: BeatNFTLicense
  onPayment?: (licenseId: string) => void
}

export default function CreatorLicenseCard({ license, onPayment }: CreatorLicenseCardProps) {
  const [paying, setPaying] = useState(false)

  const handleCryptoPayment = async () => {
    if (!onPayment) return
    
    setPaying(true)
    try {
      // Simulate crypto payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      onPayment(license.id)
    } finally {
      setPaying(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-orange-100 text-orange-800'
      case 'accepted': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const platformFee = license.negotiatedPrice * 0.15
  const creatorAmount = license.negotiatedPrice * (license.creatorRoyaltyShare / 100)
  const producerAmount = license.negotiatedPrice - platformFee - creatorAmount

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">BeatNFT™ #{license.beatNftId}</h3>
          <p className="text-sm text-gray-600">{license.licenseType} license</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(license.status)}`}>
          {license.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Price</span>
          <span className="font-medium">${license.negotiatedPrice}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Your Share ({license.creatorRoyaltyShare}%)</span>
          <span className="font-medium text-green-600">${creatorAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Platform Fee (15%)</span>
          <span className="font-medium text-gray-600">${platformFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Producer Share</span>
          <span className="font-medium">${producerAmount.toFixed(2)}</span>
        </div>
      </div>

      {license.status === 'accepted' && (
        <button
          onClick={handleCryptoPayment}
          disabled={paying}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 text-sm font-medium"
        >
          {paying ? 'Processing Payment...' : '💰 Pay with Crypto'}
        </button>
      )}

      {license.status === 'active' && (
        <div className="text-center py-2">
          <span className="text-green-600 text-sm font-medium">✅ License Active</span>
        </div>
      )}
    </div>
  )
}