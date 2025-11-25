'use client'

import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useSIWE } from './useSIWE'

interface UseWalletModalReturn {
  isOpen: boolean
  openModal: (options?: { title?: string; showSignMessage?: boolean }) => void
  closeModal: () => void
  requireConnection: () => Promise<boolean>
  requireAuthentication: () => Promise<boolean>
  modalProps: {
    title: string
    showSignMessage: boolean
  }
}

export function useWalletModal(): UseWalletModalReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [modalProps, setModalProps] = useState({
    title: 'Connect Wallet',
    showSignMessage: true
  })
  const { isConnected } = useAccount()
  const { isAuthenticated } = useSIWE()

  const openModal = useCallback((options?: { title?: string; showSignMessage?: boolean }) => {
    setModalProps({
      title: options?.title || 'Connect Wallet',
      showSignMessage: options?.showSignMessage ?? true
    })
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const requireConnection = useCallback(async (): Promise<boolean> => {
    if (isConnected) return true
    
    openModal({ title: 'Connect Wallet Required', showSignMessage: false })
    return false
  }, [isConnected, openModal])

  const requireAuthentication = useCallback(async (): Promise<boolean> => {
    if (isAuthenticated) return true
    
    if (!isConnected) {
      openModal({ title: 'Connect & Authenticate', showSignMessage: true })
      return false
    }
    
    openModal({ title: 'Authentication Required', showSignMessage: true })
    return false
  }, [isConnected, isAuthenticated, openModal])

  return {
    isOpen,
    openModal,
    closeModal,
    requireConnection,
    requireAuthentication,
    modalProps
  }
}