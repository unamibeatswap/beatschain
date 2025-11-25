/**
 * Web3 Profile Service
 * Fetches and caches Web3 profile data from various sources
 */

export interface Web3Profile {
  address: string
  ensName?: string
  avatar?: string
  displayName?: string
  bio?: string
  socialLinks?: {
    twitter?: string
    instagram?: string
    website?: string
  }
  lastUpdated?: string
}

class Web3ProfileService {
  private cache = new Map<string, { profile: Web3Profile; timestamp: number }>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  async getProfile(address: string): Promise<Web3Profile> {
    if (!address || !address.startsWith('0x')) {
      return this.createDefaultProfile(address)
    }

    // Check cache first
    const cached = this.cache.get(address.toLowerCase())
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.profile
    }

    try {
      // Try multiple sources in order of preference
      let profile = await this.fetchFromENS(address)
      
      if (!profile.ensName) {
        profile = await this.fetchFromLocalStorage(address)
      }
      
      // Enhance with social media links
      profile = await this.enhanceWithSocialLinks(profile)

      // Cache the result
      this.cache.set(address.toLowerCase(), {
        profile,
        timestamp: Date.now()
      })

      return profile
    } catch (error) {
      console.warn('Failed to fetch Web3 profile:', error)
      return this.createDefaultProfile(address)
    }
  }

  private async fetchFromENS(address: string): Promise<Web3Profile> {
    try {
      // In production, use ENS resolver
      // For now, return basic profile
      return {
        address: address.toLowerCase(),
        displayName: this.formatAddress(address),
        avatar: this.generateAvatar(address),
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      console.warn('ENS resolution failed:', error)
      return this.createDefaultProfile(address)
    }
  }

  private async fetchFromLocalStorage(address: string): Promise<Web3Profile> {
    try {
      if (typeof window === 'undefined') {
        return this.createDefaultProfile(address)
      }

      const stored = localStorage.getItem(`web3_profile_${address.toLowerCase()}`)
      if (stored) {
        const profile = JSON.parse(stored)
        return {
          ...profile,
          address: address.toLowerCase()
        }
      }

      return this.createDefaultProfile(address)
    } catch (error) {
      console.warn('Local storage profile fetch failed:', error)
      return this.createDefaultProfile(address)
    }
  }

  private createDefaultProfile(address: string): Web3Profile {
    return {
      address: address.toLowerCase(),
      displayName: this.formatAddress(address),
      avatar: this.generateAvatar(address),
      bio: 'Web3 Music Producer',
      lastUpdated: new Date().toISOString()
    }
  }

  private formatAddress(address: string): string {
    if (!address || address.length < 10) return 'Unknown'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  private generateAvatar(address: string): string {
    // Generate deterministic avatar based on address
    const colors = [
      'from-blue-400 to-purple-400',
      'from-green-400 to-blue-400', 
      'from-purple-400 to-pink-400',
      'from-yellow-400 to-orange-400',
      'from-red-400 to-pink-400',
      'from-indigo-400 to-purple-400'
    ]
    
    const hash = address.slice(2, 8)
    const colorIndex = parseInt(hash, 16) % colors.length
    
    return `bg-gradient-to-r ${colors[colorIndex]}`
  }

  async updateProfile(address: string, updates: Partial<Web3Profile>): Promise<void> {
    try {
      if (typeof window === 'undefined') return

      const current = await this.getProfile(address)
      const updated = {
        ...current,
        ...updates,
        address: address.toLowerCase(),
        lastUpdated: new Date().toISOString()
      }

      // Save to localStorage
      localStorage.setItem(`web3_profile_${address.toLowerCase()}`, JSON.stringify(updated))

      // Update cache
      this.cache.set(address.toLowerCase(), {
        profile: updated,
        timestamp: Date.now()
      })
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  private async enhanceWithSocialLinks(profile: Web3Profile): Promise<Web3Profile> {
    try {
      // Try to resolve social links from various sources
      const socialLinks = {
        twitter: await this.resolveTwitterHandle(profile.address),
        instagram: await this.resolveInstagramHandle(profile.address),
        website: await this.resolveWebsite(profile.address)
      }
      
      return {
        ...profile,
        socialLinks: {
          ...profile.socialLinks,
          ...socialLinks
        }
      }
    } catch (error) {
      console.warn('Failed to enhance social links:', error)
      return profile
    }
  }
  
  private async resolveTwitterHandle(address: string): Promise<string | undefined> {
    // In production, integrate with Twitter API or social graph
    // For now, check localStorage for user-provided data
    try {
      const socialData = localStorage.getItem(`social_${address.toLowerCase()}`)
      if (socialData) {
        const parsed = JSON.parse(socialData)
        return parsed.twitter
      }
    } catch (error) {
      console.warn('Failed to resolve Twitter handle:', error)
    }
    return undefined
  }
  
  private async resolveInstagramHandle(address: string): Promise<string | undefined> {
    try {
      const socialData = localStorage.getItem(`social_${address.toLowerCase()}`)
      if (socialData) {
        const parsed = JSON.parse(socialData)
        return parsed.instagram
      }
    } catch (error) {
      console.warn('Failed to resolve Instagram handle:', error)
    }
    return undefined
  }
  
  private async resolveWebsite(address: string): Promise<string | undefined> {
    try {
      const socialData = localStorage.getItem(`social_${address.toLowerCase()}`)
      if (socialData) {
        const parsed = JSON.parse(socialData)
        return parsed.website
      }
    } catch (error) {
      console.warn('Failed to resolve website:', error)
    }
    return undefined
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const web3ProfileService = new Web3ProfileService()