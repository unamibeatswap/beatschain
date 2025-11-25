'use client'

import { supabaseBeats } from './supabase.enhanced'

export interface LivepeerAsset {
  id: string
  name: string
  status: string
  uploadUrl?: string
  playbackUrl?: string
  mocked?: boolean
  createdAt?: number
  optimized?: boolean
}

export interface LivepeerUploadResult {
  success: boolean
  asset?: LivepeerAsset
  error?: string
  fallbackUrl?: string
}

export class LivepeerService {
  private mcpServerUrl: string
  private fallbackUpload: ((file: File, beatId: string) => Promise<string>) | null = null

  constructor() {
    this.mcpServerUrl = process.env.NEXT_PUBLIC_MCP_SERVER_URL || ''
  }

  setFallbackUpload(uploadFn: (file: File, beatId: string) => Promise<string>) {
    this.fallbackUpload = uploadFn
  }

  async uploadFile(file: File, metadata: any = {}): Promise<LivepeerUploadResult> {
    // Try Livepeer first
    if (this.mcpServerUrl) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('metadata', JSON.stringify(metadata))

        const response = await fetch(`${this.mcpServerUrl}/api/livepeer/upload-file`, {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const result = await response.json()
          const asset = { ...result.asset, optimized: true }
          
          // Save to Supabase if available
          if (metadata.beatId) {
            await supabaseBeats.updateBeat(metadata.beatId, {
              livepeer_asset_id: asset.id,
              playback_url: asset.playbackUrl || asset.uploadUrl,
              optimized_playback: true,
              source: 'livepeer'
            })
          }
          
          return { success: true, asset }
        }
      } catch (error) {
        console.warn('Livepeer upload failed, trying fallback:', error)
      }
    }

    // Fallback to IPFS
    if (this.fallbackUpload && metadata.beatId) {
      try {
        const fallbackUrl = await this.fallbackUpload(file, metadata.beatId)
        
        // Save fallback to Supabase
        await supabaseBeats.updateBeat(metadata.beatId, {
          ipfs_audio_url: fallbackUrl,
          optimized_playback: false,
          source: 'ipfs'
        })
        
        return { 
          success: true, 
          fallbackUrl,
          asset: { 
            id: `fallback-${metadata.beatId}`, 
            name: file.name, 
            status: 'ready',
            playbackUrl: fallbackUrl,
            optimized: false
          }
        }
      } catch (error) {
        console.error('Fallback upload failed:', error)
      }
    }

    return { success: false, error: 'All upload methods failed' }
  }

  async createAssetFromIPFS(ipfsCid: string, name: string, metadata: any = {}): Promise<LivepeerUploadResult> {
    if (!this.mcpServerUrl) {
      return { success: false, error: 'MCP server not configured' }
    }

    try {
      const response = await fetch(`${this.mcpServerUrl}/api/livepeer/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ipfsCid, name, metadata })
      })

      if (!response.ok) {
        const errorText = await response.text()
        return { success: false, error: `Asset creation failed: ${errorText}` }
      }

      const result = await response.json()
      return { success: true, asset: result.asset }
    } catch (error) {
      console.error('Livepeer asset creation error:', error)
      return { success: false, error: String(error) }
    }
  }

  async getAssets(): Promise<LivepeerAsset[]> {
    if (!this.mcpServerUrl) return []

    try {
      const response = await fetch(`${this.mcpServerUrl}/api/livepeer/assets`)
      
      if (!response.ok) return []

      const result = await response.json()
      return result.assets || []
    } catch (error) {
      console.error('Livepeer assets fetch error:', error)
      return []
    }
  }

  getPlaybackUrl(asset: LivepeerAsset): string | null {
    if (asset.mocked) {
      // For mocked assets, return the uploadUrl as playback
      return asset.uploadUrl || null
    }
    
    // For real Livepeer assets, playback URL comes from webhook processing
    return asset.playbackUrl || null
  }

  isOptimizedPlayback(asset: LivepeerAsset): boolean {
    return !asset.mocked && !!asset.playbackUrl
  }
}

export const livepeerService = new LivepeerService()