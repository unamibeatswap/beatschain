'use client'

import { useState, useEffect } from 'react'

export function EnvironmentStatus() {
  const [envStatus, setEnvStatus] = useState<{
    ipfsConfigured: boolean
    jwt: boolean
    gateway: boolean
  } | null>(null)

  useEffect(() => {
    const jwt = !!process.env.NEXT_PUBLIC_PINATA_JWT
    const gateway = !!process.env.NEXT_PUBLIC_IPFS_GATEWAY
    
    setEnvStatus({
      ipfsConfigured: jwt && gateway,
      jwt,
      gateway
    })
  }, [])

  if (!envStatus) return null

  // Only show if there are issues
  if (envStatus.ipfsConfigured) return null

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
        ⚠️ IPFS Not Configured
      </div>
      <div style={{ fontSize: '0.75rem' }}>
        Missing: {!envStatus.jwt && 'PINATA_JWT'} {!envStatus.gateway && 'IPFS_GATEWAY'}
      </div>
      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
        Files over 4MB will fail to upload
      </div>
    </div>
  )
}