'use client'

import { useUnifiedAuth } from '@/context/UnifiedAuthContext'
import { useAccount } from 'wagmi'

export function AuthDebug() {
  const auth = useUnifiedAuth()
  const { address } = useAccount()

  if (typeof window === 'undefined') return null

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">🔍 Auth Debug</h4>
      <div className="space-y-1">
        <div>Wallet: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'None'}</div>
        <div>Connected: {auth.wallet.isConnected ? '✅' : '❌'}</div>
        <div>Authenticated: {auth.isAuthenticated ? '✅' : '❌'}</div>
        <div>User: {auth.user?.displayName || 'None'}</div>
        <div>Role: <span className="font-bold text-yellow-300">{auth.user?.role || 'None'}</span></div>
        <div>Loading: {auth.loading ? '⏳' : '✅'}</div>
        <div>Can Access Dashboard: {auth.hasAnyRole(['producer', 'admin', 'super_admin']) ? '✅' : '❌'}</div>
        <div>Is Super Admin: {auth.hasRole('super_admin') ? '✅' : '❌'}</div>
      </div>
      
      {address && (
        <div className="mt-2 pt-2 border-t border-gray-600">
          <div className="text-xs text-gray-300">Full Address:</div>
          <div className="font-mono text-xs break-all">{address}</div>
        </div>
      )}
    </div>
  )
}