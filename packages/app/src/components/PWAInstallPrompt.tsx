'use client'

import { usePWA } from '@/hooks/usePWA'

export default function PWAInstallPrompt() {
  const { showInstallPrompt, installApp, dismissInstallPrompt } = usePWA()

  if (!showInstallPrompt) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
      right: '1rem',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      color: 'white',
      padding: '1rem',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      zIndex: 1000,
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '1.5rem' }}>📱</div>
        <div>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
            Install BeatsChain App
          </h4>
          <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
            Get the full Web3 beat experience
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={installApp}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Install
        </button>
        <button
          onClick={dismissInstallPrompt}
          style={{
            background: 'transparent',
            color: 'rgba(255,255,255,0.8)',
            border: 'none',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}