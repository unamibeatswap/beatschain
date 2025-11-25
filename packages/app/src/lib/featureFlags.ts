'use client'

interface FeatureFlags {
  enhancedWalletModal: boolean
  hybridMarketplace: boolean
  sourceIndicators: boolean
  creatorPreview: boolean
  advancedAudioPlayer: boolean
  licenseNegotiation: boolean
  realTimeNotifications: boolean
  socialSharing: boolean
}

// Default feature flags - can be overridden by environment or user preferences
const DEFAULT_FLAGS: FeatureFlags = {
  enhancedWalletModal: true,
  hybridMarketplace: true,
  sourceIndicators: true,
  creatorPreview: true,
  advancedAudioPlayer: true,
  licenseNegotiation: true,
  realTimeNotifications: true,
  socialSharing: true
}

// Environment-based overrides
const ENV_FLAGS: Partial<FeatureFlags> = {
  // Production flags
  ...(process.env.NODE_ENV === 'production' && {
    enhancedWalletModal: true,
    hybridMarketplace: true,
    sourceIndicators: true
  }),
  // Development flags
  ...(process.env.NODE_ENV === 'development' && {
    enhancedWalletModal: true,
    hybridMarketplace: true,
    sourceIndicators: true,
    creatorPreview: true,
    advancedAudioPlayer: true
  })
}

class FeatureFlagManager {
  private flags: FeatureFlags
  private listeners: Set<() => void> = new Set()

  constructor() {
    this.flags = { ...DEFAULT_FLAGS, ...ENV_FLAGS }
    this.loadUserPreferences()
  }

  private loadUserPreferences() {
    if (typeof window === 'undefined') return
    
    try {
      const saved = localStorage.getItem('beatschain_feature_flags')
      if (saved) {
        const userFlags = JSON.parse(saved)
        this.flags = { ...this.flags, ...userFlags }
      }
    } catch (error) {
      console.warn('Failed to load feature flags from localStorage:', error)
    }
  }

  private saveUserPreferences() {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem('beatschain_feature_flags', JSON.stringify(this.flags))
    } catch (error) {
      console.warn('Failed to save feature flags to localStorage:', error)
    }
  }

  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags[flag] ?? false
  }

  enable(flag: keyof FeatureFlags) {
    this.flags[flag] = true
    this.saveUserPreferences()
    this.notifyListeners()
  }

  disable(flag: keyof FeatureFlags) {
    this.flags[flag] = false
    this.saveUserPreferences()
    this.notifyListeners()
  }

  toggle(flag: keyof FeatureFlags) {
    this.flags[flag] = !this.flags[flag]
    this.saveUserPreferences()
    this.notifyListeners()
  }

  getAll(): FeatureFlags {
    return { ...this.flags }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener())
  }
}

// Singleton instance
export const featureFlags = new FeatureFlagManager()

// React hook for feature flags
import { useState, useEffect } from 'react'

export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  const [isEnabled, setIsEnabled] = useState(() => featureFlags.isEnabled(flag))

  useEffect(() => {
    const unsubscribe = featureFlags.subscribe(() => {
      setIsEnabled(featureFlags.isEnabled(flag))
    })
    return unsubscribe
  }, [flag])

  return isEnabled
}

export function useFeatureFlags(): FeatureFlags & {
  enable: (flag: keyof FeatureFlags) => void
  disable: (flag: keyof FeatureFlags) => void
  toggle: (flag: keyof FeatureFlags) => void
} {
  const [flags, setFlags] = useState(() => featureFlags.getAll())

  useEffect(() => {
    const unsubscribe = featureFlags.subscribe(() => {
      setFlags(featureFlags.getAll())
    })
    return unsubscribe
  }, [])

  return {
    ...flags,
    enable: featureFlags.enable.bind(featureFlags),
    disable: featureFlags.disable.bind(featureFlags),
    toggle: featureFlags.toggle.bind(featureFlags)
  }
}