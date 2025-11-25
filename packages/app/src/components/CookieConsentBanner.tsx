'use client'

import { useState, useEffect } from 'react'
import { getStorageItem, setStorageItem } from '@/utils/storage'

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = getStorageItem<string>('cookie-consent')
    if (!hasConsented) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    // Store consent for 180 days (6 months)
    setStorageItem('cookie-consent', 'accepted', 180)
    setShowBanner(false)
    
    // Enable Google Analytics if not already enabled
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      })
    }
  }

  const handleDecline = () => {
    // Store consent for 180 days (6 months)
    setStorageItem('cookie-consent', 'declined', 180)
    setShowBanner(false)
    
    // Disable Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      })
    }
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🍪</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Cookie & Analytics Notice</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We use <strong>Google Analytics</strong> for marketing insights and website improvement. 
                  Your Web3 wallet data stays private on the blockchain. We don't track personal information, 
                  only anonymous usage patterns to enhance your experience.
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                  {' • '}
                  <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Decline Analytics
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}