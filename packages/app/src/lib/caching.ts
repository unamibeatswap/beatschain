export interface CacheEntry<T> {
  data: T
  timestamp: number
  expiry: number
}

export class CacheManager {
  private static readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes
  
  static set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    if (typeof window === 'undefined') return
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + ttl
      }
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry))
    } catch (error) {
      console.warn('Cache set failed:', error)
    }
  }

  static get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem(`cache_${key}`)
      if (!stored) return null

      const entry: CacheEntry<T> = JSON.parse(stored)
      
      if (Date.now() > entry.expiry) {
        this.delete(key)
        return null
      }

      return entry.data
    } catch (error) {
      console.warn('Cache get failed:', error)
      return null
    }
  }

  static delete(key: string): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(`cache_${key}`)
    } catch (error) {
      console.warn('Cache delete failed:', error)
    }
  }

  static clear(): void {
    if (typeof window === 'undefined') return
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'))
      keys.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.warn('Cache clear failed:', error)
    }
  }

  static isExpired(key: string): boolean {
    if (typeof window === 'undefined') return true
    try {
      const stored = localStorage.getItem(`cache_${key}`)
      if (!stored) return true

      const entry: CacheEntry<any> = JSON.parse(stored)
      return Date.now() > entry.expiry
    } catch (error) {
      return true
    }
  }

  // Specialized methods for beat data
  static setBeatMetadata(tokenId: string, metadata: any): void {
    this.set(`beat_metadata_${tokenId}`, metadata, 10 * 60 * 1000) // 10 minutes
  }

  static getBeatMetadata(tokenId: string): any | null {
    return this.get(`beat_metadata_${tokenId}`)
  }

  static setBeatIndex(beats: any[]): void {
    this.set('beat_index', beats, 2 * 60 * 1000) // 2 minutes
  }

  static getBeatIndex(): any[] | null {
    return this.get('beat_index')
  }

  static setIPFSContent(hash: string, content: any): void {
    this.set(`ipfs_${hash}`, content, 30 * 60 * 1000) // 30 minutes
  }

  static getIPFSContent(hash: string): any | null {
    return this.get(`ipfs_${hash}`)
  }
}