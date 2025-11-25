'use client'

import { useState } from 'react'
import { useContract } from './useContract'

export interface LicenseType {
  id: 'basic' | 'premium' | 'exclusive'
  name: string
  description: string
  price: number // Multiplier of base price
  features: string[]
  maxUses?: number
  commercial: boolean
  resellable: boolean
}

export const LICENSE_TYPES: LicenseType[] = [
  {
    id: 'basic',
    name: 'Basic License',
    description: 'Perfect for demos and non-commercial use',
    price: 0.8,
    features: [
      'MP3 & WAV files',
      'Non-commercial use',
      'Social media posting',
      'Demo recordings'
    ],
    maxUses: 1000,
    commercial: false,
    resellable: false
  },
  {
    id: 'premium',
    name: 'Premium License',
    description: 'Full commercial rights for professional releases',
    price: 1.0,
    features: [
      'All file formats',
      'Commercial use',
      'Radio & streaming',
      'Music videos',
      'Live performances'
    ],
    commercial: true,
    resellable: true
  },
  {
    id: 'exclusive',
    name: 'Exclusive License',
    description: 'Complete ownership and exclusive rights',
    price: 8.0,
    features: [
      'Exclusive ownership',
      'All commercial rights',
      'Resale rights',
      'Remix rights',
      'No other sales',
      'Producer credit optional'
    ],
    commercial: true,
    resellable: true
  }
]

export interface LicenseNFT {
  tokenId: string
  licenseType: LicenseType
  beatTokenId: string
  owner: string
  isActive: boolean
  purchaseDate: Date
  expiryDate?: Date
}

export function useLicensing() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { contract } = useContract()

  const purchaseLicense = async (
    beatTokenId: string,
    licenseType: LicenseType,
    paymentAmount: string
  ): Promise<string | null> => {
    if (!contract) {
      setError('Contract not available')
      return null
    }

    try {
      setLoading(true)
      setError(null)

      // In a real implementation, this would:
      // 1. Call smart contract to mint license NFT
      // 2. Link license to beat NFT
      // 3. Set license terms and restrictions
      
      console.log('Purchasing license:', {
        beatTokenId,
        licenseType: licenseType.id,
        amount: paymentAmount
      })

      // Mock license NFT creation
      const licenseTokenId = `license-${beatTokenId}-${licenseType.id}-${Date.now()}`
      
      // Store license data (in real app, this would be on-chain)
      const licenseData: LicenseNFT = {
        tokenId: licenseTokenId,
        licenseType,
        beatTokenId,
        owner: '0xUser', // Would be actual user address
        isActive: true,
        purchaseDate: new Date(),
        expiryDate: licenseType.maxUses ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : undefined
      }

      // Store in localStorage for demo
      const existingLicenses = JSON.parse(localStorage.getItem('user-licenses') || '[]')
      existingLicenses.push(licenseData)
      localStorage.setItem('user-licenses', JSON.stringify(existingLicenses))

      return licenseTokenId
    } catch (err: any) {
      console.error('License purchase failed:', err)
      setError(err.message || 'License purchase failed')
      return null
    } finally {
      setLoading(false)
    }
  }

  const getUserLicenses = (): LicenseNFT[] => {
    try {
      const stored = localStorage.getItem('user-licenses')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.warn('Failed to load user licenses:', error)
      return []
    }
  }

  const getLicensesForBeat = (beatTokenId: string): LicenseNFT[] => {
    return getUserLicenses().filter(license => 
      license.beatTokenId === beatTokenId && license.isActive
    )
  }

  const hasLicense = (beatTokenId: string, licenseType?: string): boolean => {
    const licenses = getLicensesForBeat(beatTokenId)
    if (!licenseType) return licenses.length > 0
    return licenses.some(license => license.licenseType.id === licenseType)
  }

  const getHighestLicense = (beatTokenId: string): LicenseType | null => {
    const licenses = getLicensesForBeat(beatTokenId)
    if (licenses.length === 0) return null

    // Return highest tier license
    const licenseHierarchy = { basic: 1, premium: 2, exclusive: 3 }
    const highest = licenses.reduce((prev, current) => 
      licenseHierarchy[current.licenseType.id] > licenseHierarchy[prev.licenseType.id] 
        ? current : prev
    )

    return highest.licenseType
  }

  const calculateLicensePrice = (basePrice: number, licenseType: LicenseType): number => {
    return basePrice * licenseType.price
  }

  return {
    licenseTypes: LICENSE_TYPES,
    purchaseLicense,
    getUserLicenses,
    getLicensesForBeat,
    hasLicense,
    getHighestLicense,
    calculateLicensePrice,
    loading,
    error
  }
}