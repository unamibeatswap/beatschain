'use client'

import { useState, useEffect } from 'react'
import { usePayments } from '@/hooks/usePayments.enhanced'
import { useNotifications } from '@/context/NotificationsEnhanced'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'
import { useEnhancedToast } from '@/hooks/useToast.enhanced'
import { Beat } from '@/types/data'

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  beat: Beat
}

export default function PurchaseModal({ isOpen, onClose, beat }: PurchaseModalProps) {
  const [licenseType, setLicenseType] = useState<'basic' | 'premium' | 'exclusive'>('basic')
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'fiat'>('crypto')
  const [purchaseError, setPurchaseError] = useState<string | null>(null)
  const { purchaseWithCrypto, processing, error } = usePayments()
  const { user, isAuthenticated, wallet, connectWallet } = useUnifiedAuth()
  const { addNotification } = useNotifications()
  const { success, cleanup } = useEnhancedToast()
  
  // Cleanup notifications on component unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  if (!isOpen) return null

  const licenseOptions = {
    basic: { 
      price: beat.price * 0.8, 
      name: 'Basic License', 
      description: 'For non-commercial use',
      features: ['MP3 format', 'Personal use only', 'No commercial rights']
    },
    premium: { 
      price: beat.price, 
      name: 'Premium License', 
      description: 'Commercial use allowed',
      features: ['WAV format', 'Commercial use', 'Monetization allowed', 'Credit required']
    },
    exclusive: { 
      price: beat.price * 5, 
      name: 'Exclusive License', 
      description: 'Full ownership rights',
      features: ['All formats (WAV, MP3, Stems)', 'Full ownership transfer', 'No royalties', 'No credit required']
    }
  }

  const handlePurchase = async () => {
    setPurchaseError(null)
    
    // Check wallet connection for crypto payments
    if (paymentMethod === 'crypto' && !wallet.isConnected) {
      setPurchaseError('Please connect your wallet for crypto payments')
      connectWallet()
      return
    }

    // Check authentication
    if (!isAuthenticated) {
      setPurchaseError('Please sign in to complete purchase')
      return
    }

    const purchaseData = {
      beatId: beat.id,
      price: licenseOptions[licenseType].price,
      licenseType,
      producerId: beat.producerId
    }

    try {
      if (paymentMethod === 'crypto') {
        const result = await purchaseWithCrypto(purchaseData)
        if (result?.success) {
          // Show single success notification with proper throttling
          success(`🎵 Successfully purchased "${beat.title}" with ${licenseType} license!`, {
            throttleKey: `purchase-${beat.id}-${licenseType}`,
            throttleMs: 10000,
            once: true
          })
          
          // Add notification
          addNotification(
            `You purchased "${beat.title}" with ${licenseType} license`,
            {
              type: 'purchase',
              beatId: beat.id,
              beatTitle: beat.title,
              amount: licenseOptions[licenseType].price,
              currency: 'ETH',
              transactionHash: result.transactionHash,
              metadata: {
                licenseType,
                producerId: beat.producerId,
                producerName: beat.producerName
              }
            }
          )
          
          onClose()
          
          // Store purchase in local storage for demo
          const purchases = JSON.parse(localStorage.getItem('user_purchases') || '[]')
          purchases.push({
            ...purchaseData,
            beatTitle: beat.title,
            purchaseDate: new Date().toISOString(),
            transactionHash: result.transactionHash
          })
          localStorage.setItem('user_purchases', JSON.stringify(purchases))
        }
      } else {
        // Fiat payment not implemented yet
        setPurchaseError('Fiat payments are not available yet. Please use crypto.')
      }
    } catch (err: any) {
      console.error('Purchase failed:', err)
      setPurchaseError(err.message || 'Purchase failed. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Purchase Beat</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Beat Info */}
          <div className="flex items-center gap-3 mb-4">
            {beat.coverImageUrl ? (
              <img 
                src={beat.coverImageUrl} 
                alt={beat.title} 
                className="w-12 h-12 rounded object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded flex items-center justify-center text-white text-xl">
                🎵
              </div>
            )}
            <div>
              <h3 className="font-bold text-gray-900">{beat.title}</h3>
              <p className="text-sm text-gray-500">
                {beat.producerName} • {beat.genre} • {beat.bpm} BPM
              </p>
              <div className="text-lg font-bold text-green-600 mt-1">
                {beat.price.toFixed(3)} ETH
              </div>
            </div>
          </div>

          {/* Error Message */}
          {(purchaseError || error) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              ⚠️ {purchaseError || error}
            </div>
          )}

          {/* License Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Type
            </label>
            <div className="space-y-3">
              {Object.entries(licenseOptions).map(([key, option]) => (
                <label
                  key={key}
                  className={`block border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    licenseType === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="license"
                    value={key}
                    checked={licenseType === key}
                    onChange={(e) => setLicenseType(e.target.value as any)}
                    className="sr-only"
                  />
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-900">{option.name}</span>
                      <span className="font-bold text-green-600">{option.price.toFixed(3)} ETH</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {option.description}
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {option.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <span className="mr-1 text-green-500">✓</span> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer ${
                  paymentMethod === 'crypto'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="crypto"
                  checked={paymentMethod === 'crypto'}
                  onChange={() => setPaymentMethod('crypto')}
                  className="sr-only"
                />
                <span className="flex items-center">
                  <span className="mr-2">⚡</span> Crypto
                </span>
              </label>
              <label
                className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer ${
                  paymentMethod === 'fiat'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 opacity-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="fiat"
                  checked={paymentMethod === 'fiat'}
                  onChange={() => setPaymentMethod('fiat')}
                  className="sr-only"
                  disabled
                />
                <span className="flex items-center">
                  <span className="mr-2">💳</span> Card/PayPal
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: Fiat payments coming soon. Currently only crypto payments are supported.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              disabled={processing}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
            >
              {processing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                `Purchase for ${licenseOptions[licenseType].price.toFixed(3)} ETH`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}