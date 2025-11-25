'use client'

import { useAccount } from 'wagmi'

export function usePreviewAccess() {
  const { isConnected } = useAccount()

  // Simple rule: Connected wallets get full access, unconnected get 30s previews
  const canAccessFullBeat = isConnected

  return {
    canAccessFullBeat,
    isConnected
  }
}