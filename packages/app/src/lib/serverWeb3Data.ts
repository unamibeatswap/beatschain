// Server-side Web3 data access - Enhanced with realistic beat data
// This provides better fallback data that looks like real localStorage beats

import { getLocalStorageBeatData, getEnhancedBeatMetadata } from './beatDataBridge'

export interface ServerBeat {
  id: string
  title: string
  description: string
  genre: string
  bpm: number
  key: string
  price: number
  producerName?: string
  stageName?: string
  coverImageUrl?: string
  audioUrl?: string
  tags?: string[]
  licenseType?: string
  createdAt: string
  status: string
  isActive: boolean
  source: string
}

export function getServerBeatData(beatId: string): ServerBeat | null {
  // Use the enhanced bridge for better localStorage simulation
  return getLocalStorageBeatData(beatId)
}

// Export enhanced metadata function for social sharing
export { getEnhancedBeatMetadata }