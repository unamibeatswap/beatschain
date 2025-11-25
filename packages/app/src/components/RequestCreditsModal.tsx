'use client'

import { useState } from 'react'
import { useEnhancedToast } from '@/hooks/useToast.enhanced'

interface RequestCreditsModalProps {
  isOpen: boolean
  onClose: () => void
  userAddress: string
}

export default function RequestCreditsModal({ isOpen, onClose, userAddress }: RequestCreditsModalProps) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { success, error } = useEnhancedToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return

    setSubmitting(true)
    
    try {
      // Simulate support request
      const requestData = {
        userAddress,
        reason: reason.trim(),
        timestamp: new Date().toISOString(),
        status: 'pending'
      }
      
      // Store request locally (in production: send to support system)
      const requests = JSON.parse(localStorage.getItem('credit_requests') || '[]')
      requests.push(requestData)
      localStorage.setItem('credit_requests', JSON.stringify(requests))
      
      // Grant 20 bonus credits immediately for demo
      const balanceKey = `beatnft_balance_${userAddress}`
      const currentBalance = JSON.parse(localStorage.getItem(balanceKey) || '{"credits": 10, "hasProNFT": false, "totalUsed": 0}')
      currentBalance.credits += 20
      currentBalance.bonusCreditsReceived = (currentBalance.bonusCreditsReceived || 0) + 20
      localStorage.setItem(balanceKey, JSON.stringify(currentBalance))
      
      success('✅ Support request submitted! 20 bonus credits added to your account.', {
        throttleKey: 'credit-request-success',
        throttleMs: 5000
      })
      
      onClose()
      setReason('')
      
    } catch (err) {
      error('Failed to submit request. Please try again.', {
        throttleKey: 'credit-request-error',
        throttleMs: 3000
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Request Support Credits</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">🎯 Onboarding Support</h3>
          <p className="text-sm text-blue-700">
            New producers can request additional credits to help with initial uploads and minting. 
            Tell us about your music and we'll provide bonus credits!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tell us about your music and why you need additional credits:
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., I'm a new producer from SA with 5 beats ready to upload. I need credits for uploads and minting..."
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !reason.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Request Credits'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}