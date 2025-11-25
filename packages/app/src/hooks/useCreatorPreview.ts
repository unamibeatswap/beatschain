'use client'

import { useContentCreator } from './useContentCreator'

export function useCreatorPreview() {
  const { creator, isCreator } = useContentCreator()

  const canPreviewFullBeat = (): boolean => {
    if (!isCreator || !creator) return false
    
    // Tier-based preview access
    switch (creator.verificationTier) {
      case 'platinum': return true  // Full access
      case 'gold': return true     // Full access
      case 'silver': return creator.audienceSize >= 10000 // 10K+ audience
      case 'bronze': return creator.audienceSize >= 50000 // 50K+ audience for bronze
      default: return false
    }
  }

  const getPreviewReason = (): string => {
    if (!isCreator) return 'Register as creator for preview access'
    if (!creator) return 'Creator profile required'
    
    if (canPreviewFullBeat()) {
      return `Full preview access (${creator.verificationTier} tier)`
    }
    
    const required = creator.verificationTier === 'bronze' ? '50K' : '10K'
    const current = creator.audienceSize.toLocaleString()
    return `Need ${required}+ audience (current: ${current})`
  }

  const getPreviewDuration = (): number => {
    if (!canPreviewFullBeat()) return 30 // 30 seconds for regular users
    
    // Full track for qualified creators
    return -1 // -1 means full track
  }

  return {
    canPreviewFullBeat: canPreviewFullBeat(),
    previewReason: getPreviewReason(),
    previewDuration: getPreviewDuration()
  }
}