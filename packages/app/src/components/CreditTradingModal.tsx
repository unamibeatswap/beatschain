'use client'

import { useState, useEffect } from 'react'
import { useBeatNFTCreditTrading } from '@/hooks/useBeatNFTCreditTrading'
import { useBeatNFT } from '@/hooks/useBeatNFT'

interface CreditTradingModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'buy' | 'sell' | 'gift'
}

export default function CreditTradingModal({ isOpen, onClose, mode }: CreditTradingModalProps) {
  const { balance } = useBeatNFT()
  const { listings, loading, listCreditsForSale, buyCredits, giftCredits, loadMarketListings } = useBeatNFTCreditTrading()
  const [credits, setCredits] = useState(10)
  const [pricePerCredit, setPricePerCredit] = useState(1.5) // $1.50 vs $1.80 platform price
  const [recipientAddress, setRecipientAddress] = useState('')

  useEffect(() => {
    if (isOpen && mode === 'buy') {
      loadMarketListings()
    }
  }, [isOpen, mode])

  if (!isOpen) return null

  const handleSell = async () => {
    const success = await listCreditsForSale(credits, pricePerCredit)
    if (success) onClose()
  }

  const handleBuy = async (listingId: string) => {
    const success = await buyCredits(listingId)
    if (success) {
      loadMarketListings()
    }
  }

  const handleGift = async () => {
    const success = await giftCredits(recipientAddress, credits)
    if (success) onClose()
  }

  const platformPrice = 1.8 // $18 for 10 credits = $1.80 per credit
  const savings = ((platformPrice - pricePerCredit) / platformPrice * 100).toFixed(0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'buy' && '🛒 Buy BeatNFT Credits'}
              {mode === 'sell' && '🏪 Sell BeatNFT Credits'}  
              {mode === 'gift' && '🎁 Gift BeatNFT Credits'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          {mode === 'sell' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg text-sm">
                <p className="text-blue-900 font-medium">Your Balance: {balance.credits} credits</p>
                <p className="text-blue-700">Platform price: $1.80/credit • Your price: ${pricePerCredit}/credit</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credits to Sell</label>
                <input
                  type="number"
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  max={balance.credits}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per Credit ($)</label>
                <input
                  type="number"
                  step="0.1"
                  value={pricePerCredit}
                  onChange={(e) => setPricePerCredit(Number(e.target.value))}
                  max="1.79"
                  min="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-green-600 mt-1">
                  Buyers save {savings}% vs platform price!
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Total Listing Value:</span>
                  <span className="font-medium">${(credits * pricePerCredit).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSell}
                disabled={loading || credits > balance.credits}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Listing...' : 'List Credits for Sale'}
              </button>
            </div>
          )}

          {mode === 'buy' && (
            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded-lg text-sm">
                <p className="text-green-900 font-medium">💰 Save money buying from other users!</p>
                <p className="text-green-700">Platform: $1.80/credit • Market: $1.20-1.60/credit</p>
              </div>

              {listings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🏪</div>
                  <p className="text-gray-600">No credits for sale</p>
                  <p className="text-sm text-gray-500">Check back later or buy from platform</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {listings.map((listing) => (
                    <div key={listing.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium">{listing.credits} credits</p>
                          <p className="text-sm text-gray-600">
                            ${listing.pricePerCredit}/credit • Save {((1.8 - listing.pricePerCredit) / 1.8 * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">${listing.totalPrice.toFixed(2)}</p>
                          <button
                            onClick={() => handleBuy(listing.id)}
                            disabled={loading}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {mode === 'gift' && (
            <div className="space-y-4">
              <div className="bg-purple-50 p-3 rounded-lg text-sm">
                <p className="text-purple-900 font-medium">🎁 Gift BeatNFT credits to other users</p>
                <p className="text-purple-700">Your balance: {balance.credits} credits</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Wallet Address</label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credits to Gift</label>
                <input
                  type="number"
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  max={balance.credits}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <button
                onClick={handleGift}
                disabled={loading || credits > balance.credits || !recipientAddress}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Sending Gift...' : `🎁 Gift ${credits} Credits`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}