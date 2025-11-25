'use client'

import { useState } from 'react'

export function UploadDiagnostics() {
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  
  const runDiagnostics = () => {
    const jwt = !!process.env.NEXT_PUBLIC_PINATA_JWT
    const gateway = !!process.env.NEXT_PUBLIC_IPFS_GATEWAY
    const ipfsReady = jwt && gateway
    
    console.log('🔧 Upload Diagnostics:')
    console.log('Environment:', process.env.NODE_ENV)
    console.log('IPFS JWT:', jwt ? '✅ SET' : '❌ MISSING')
    console.log('IPFS Gateway:', gateway ? '✅ SET' : '❌ MISSING')
    console.log('IPFS Ready:', ipfsReady ? '✅ YES' : '❌ NO')
    console.log('localStorage Available:', typeof Storage !== 'undefined' ? '✅ YES' : '❌ NO')
    
    if (!ipfsReady) {
      console.warn('⚠️ Files >4MB will fail - IPFS configuration required')
    }
    
    setShowDiagnostics(true)
    setTimeout(() => setShowDiagnostics(false), 3000)
  }

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      <button
        onClick={runDiagnostics}
        style={{
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          cursor: 'pointer'
        }}
      >
        🔧 Run Upload Diagnostics
      </button>
      
      {showDiagnostics && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          right: '0',
          background: '#1f2937',
          color: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '0.5rem',
          fontSize: '0.75rem',
          whiteSpace: 'nowrap'
        }}>
          ✅ Diagnostics logged to console
        </div>
      )}
    </div>
  )
}