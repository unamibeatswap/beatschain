'use client'

import { useState } from 'react'
import { useContentCreator } from './useContentCreator'
import { Beat } from '@/types'

interface BulkLicensePackage {
  id: string
  name: string
  beats: Beat[]
  totalPrice: number
  discountPercentage: number
  creatorRoyaltyShare: number
  licenseType: 'personal' | 'commercial' | 'sync' | 'exclusive'
  validUntil: Date
}

interface CustomTemplate {
  id: string
  name: string
  licenseType: string
  royaltyShare: number
  terms: {
    duration: number
    territory: string
    exclusivity: boolean
    commercialUse: boolean
    syncRights: boolean
  }
  createdAt: Date
}

export function useBulkLicensing() {
  const { creator } = useContentCreator()
  const [packages, setPackages] = useState<BulkLicensePackage[]>([])
  const [templates, setTemplates] = useState<CustomTemplate[]>([])
  const [loading, setLoading] = useState(false)

  const createBulkPackage = async (
    name: string,
    beatIds: string[],
    licenseType: BulkLicensePackage['licenseType']
  ): Promise<boolean> => {
    if (!creator) return false
    
    setLoading(true)
    try {
      // Simulate bulk package creation
      const mockBeats: Beat[] = beatIds.map(id => ({
        id,
        beatNftId: id,
        title: `Beat ${id}`,
        description: 'Bulk licensed beat',
        producerId: 'producer_123',
        audioUrl: '',
        coverImageUrl: '',
        price: 100 + Math.random() * 100,
        genre: 'Hip Hop',
        bpm: 120,
        key: 'C',
        tags: [],
        isNFT: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      
      const totalPrice = mockBeats.reduce((sum, beat) => sum + beat.price, 0)
      const discountPercentage = Math.min(beatIds.length * 5, 30) // Up to 30% discount
      const discountedPrice = totalPrice * (1 - discountPercentage / 100)
      
      const package: BulkLicensePackage = {
        id: `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        beats: mockBeats,
        totalPrice: discountedPrice,
        discountPercentage,
        creatorRoyaltyShare: getCreatorTierRoyalty(creator.verificationTier),
        licenseType,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
      
      setPackages(prev => [...prev, package])
      return true
    } catch (error) {
      console.error('Failed to create bulk package:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const createCustomTemplate = async (
    name: string,
    licenseType: string,
    royaltyShare: number,
    terms: CustomTemplate['terms']
  ): Promise<boolean> => {
    try {
      const template: CustomTemplate = {
        id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        licenseType,
        royaltyShare,
        terms,
        createdAt: new Date()
      }
      
      setTemplates(prev => [...prev, template])
      
      // Store in localStorage
      const stored = localStorage.getItem(`license_templates_${creator?.walletAddress}`) || '[]'
      const existing = JSON.parse(stored)
      existing.push(template)
      localStorage.setItem(`license_templates_${creator?.walletAddress}`, JSON.stringify(existing))
      
      return true
    } catch (error) {
      console.error('Failed to create template:', error)
      return false
    }
  }

  const getCreatorTierRoyalty = (tier: string): number => {
    switch (tier) {
      case 'platinum': return 40
      case 'gold': return 30
      case 'silver': return 25
      default: return 20
    }
  }

  const calculateBulkSavings = (individualPrices: number[], bulkPrice: number): number => {
    const totalIndividual = individualPrices.reduce((sum, price) => sum + price, 0)
    return totalIndividual - bulkPrice
  }

  return {
    packages,
    templates,
    loading,
    createBulkPackage,
    createCustomTemplate,
    calculateBulkSavings
  }
}