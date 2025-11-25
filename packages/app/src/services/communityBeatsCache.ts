/**
 * Community Beats Cache Service
 * Maintains real-time Web3 beats discovery across profiles
 */

interface CommunityBeat {
  id: string
  title: string
  producerId: string
  source: 'localStorage' | 'blockchain' | 'community'
  discoveredAt: string
  isActive: boolean
}

class CommunityBeatsCache {
  private cache: Map<string, CommunityBeat> = new Map()
  private lastUpdate: number = 0
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  async getBeats(): Promise<CommunityBeat[]> {
    if (this.shouldRefresh()) {
      await this.refreshCache()
    }
    
    return Array.from(this.cache.values())
      .filter(beat => beat.isActive)
      .sort((a, b) => new Date(b.discoveredAt).getTime() - new Date(a.discoveredAt).getTime())
  }

  private shouldRefresh(): boolean {
    return Date.now() - this.lastUpdate > this.CACHE_TTL
  }

  private async refreshCache(): Promise<void> {
    try {
      // Discover beats from live application
      await this.discoverFromAPI()
      
      // Update timestamp
      this.lastUpdate = Date.now()
      
      console.log(`Community cache refreshed: ${this.cache.size} beats`)
    } catch (error) {
      console.warn('Failed to refresh community cache:', error)
    }
  }

  private async discoverFromAPI(): Promise<void> {
    try {
      const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : 'https://beatschain.app'
      
      // Discover from community beats API
      try {
        const response = await fetch(`${baseUrl}/api/community-beats`, {
          headers: {
            'User-Agent': 'BeatsChain-CommunityCache/1.0'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.success && data.beats) {
            data.beats.forEach((beat: any) => {
              this.cache.set(beat.id, {
                id: beat.id,
                title: beat.title,
                producerId: beat.producerId,
                source: 'community',
                discoveredAt: beat.discoveredAt || new Date().toISOString(),
                isActive: beat.isActive
              })
            })
          }
        }
      } catch (error) {
        console.warn('Failed to fetch community beats:', error)
      }
    } catch (error) {
      console.warn('Error discovering beats from API:', error)
    }
  }

  addBeat(beat: CommunityBeat): void {
    this.cache.set(beat.id, beat)
  }

  removeBeat(beatId: string): void {
    this.cache.delete(beatId)
  }

  clear(): void {
    this.cache.clear()
    this.lastUpdate = 0
  }
}

export const communityBeatsCache = new CommunityBeatsCache()