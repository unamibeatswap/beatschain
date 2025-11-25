'use client'

import { useRobustAuth } from '@/hooks/useRobustAuth'

export function AuthTest() {
  const auth = useRobustAuth()

  if (typeof window === 'undefined') {
    return <div>Loading...</div>
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">🔐 Auth System Status</h3>
      <div className="space-y-1 text-sm">
        <div>Loading: {auth.loading ? '⏳' : '✅'}</div>
        <div>Wallet Connected: {auth.wallet.isConnected ? '✅' : '❌'}</div>
        <div>Authenticated: {auth.isAuthenticated ? '✅' : '❌'}</div>
        <div>User: {auth.user?.displayName || 'None'}</div>
        <div>Role: {auth.user?.role || 'None'}</div>
        <div>Address: {auth.wallet.address ? `${auth.wallet.address.slice(0, 6)}...${auth.wallet.address.slice(-4)}` : 'None'}</div>
      </div>
      
      {!auth.wallet.isConnected && (
        <button 
          onClick={auth.connectWallet}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Connect Wallet
        </button>
      )}
      
      {auth.wallet.isConnected && (
        <button 
          onClick={auth.signOut}
          className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          Disconnect
        </button>
      )}
    </div>
  )
}