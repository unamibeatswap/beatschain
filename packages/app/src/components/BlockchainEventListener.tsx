'use client'

import { useBlockchainEvents } from '@/hooks/useBlockchainEvents'
import { useContractEvents } from '@/hooks/useContractEvents'

export default function BlockchainEventListener() {
  // Disabled automatic event listeners to prevent persistent notifications
  // useBlockchainEvents()
  // useContractEvents()
  
  // This component doesn't render anything
  return null
}