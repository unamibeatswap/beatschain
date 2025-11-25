import { IPFSClient } from './ipfs'

export interface BeatMetadata {
  name: string
  description: string
  image: string
  audio: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  external_url?: string
  animation_url?: string
}

export interface OnChainBeatData {
  tokenId: string
  producer: string
  price: string
  royaltyPercentage: number
  isActive: boolean
  metadataURI: string
}

export interface DecentralizedBeat {
  // On-chain data
  tokenId: string
  producer: string
  price: string
  royaltyPercentage: number
  isActive: boolean
  
  // IPFS metadata
  title: string
  description: string
  genre: string
  bpm: number
  key: string
  tags: string[]
  audioUrl: string
  coverImageUrl: string
  
  // Computed fields
  createdAt: Date
  updatedAt: Date
}

export class MetadataManager {
  static async createBeatMetadata(beat: {
    title: string
    description: string
    genre: string
    bpm: number
    key: string
    tags: string[]
    producerId: string
    audioUrl: string
    coverImageUrl?: string
  }): Promise<BeatMetadata> {
    return {
      name: beat.title,
      description: beat.description,
      image: beat.coverImageUrl || '',
      audio: beat.audioUrl,
      attributes: [
        { trait_type: 'Genre', value: beat.genre },
        { trait_type: 'BPM', value: beat.bpm },
        { trait_type: 'Key', value: beat.key },
        { trait_type: 'Producer', value: beat.producerId },
        { trait_type: 'Type', value: 'Beat' },
        ...beat.tags.map(tag => ({ trait_type: 'Tag', value: tag }))
      ],
      external_url: `${process.env.NEXT_PUBLIC_APP_URL}/beat/${beat.title.toLowerCase().replace(/\s+/g, '-')}`
    }
  }

  static async uploadMetadata(metadata: BeatMetadata): Promise<string> {
    const result = await IPFSClient.uploadJSON(metadata, `${metadata.name}-metadata`)
    return result.hash
  }

  static async fetchMetadata(metadataURI: string): Promise<BeatMetadata> {
    const response = await IPFSClient.getFile(metadataURI)
    return response.json()
  }

  static async combineBeatData(
    onChainData: OnChainBeatData,
    metadataURI?: string
  ): Promise<DecentralizedBeat> {
    let metadata: BeatMetadata | null = null
    
    if (metadataURI || onChainData.metadataURI) {
      try {
        metadata = await this.fetchMetadata(metadataURI || onChainData.metadataURI)
      } catch (error) {
        console.warn('Failed to fetch metadata:', error)
      }
    }

    return {
      tokenId: onChainData.tokenId,
      producer: onChainData.producer,
      price: onChainData.price,
      royaltyPercentage: onChainData.royaltyPercentage,
      isActive: onChainData.isActive,
      
      title: metadata?.name || `Beat #${onChainData.tokenId}`,
      description: metadata?.description || '',
      genre: this.extractAttribute(metadata, 'Genre') || 'Unknown',
      bpm: Number(this.extractAttribute(metadata, 'BPM')) || 0,
      key: this.extractAttribute(metadata, 'Key') || '',
      tags: this.extractTags(metadata),
      audioUrl: metadata?.audio || '',
      coverImageUrl: metadata?.image || '',
      
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  private static extractAttribute(metadata: BeatMetadata | null, traitType: string): string {
    if (!metadata?.attributes) return ''
    const attr = metadata.attributes.find(a => a.trait_type === traitType)
    return attr?.value?.toString() || ''
  }

  private static extractTags(metadata: BeatMetadata | null): string[] {
    if (!metadata?.attributes) return []
    return metadata.attributes
      .filter(a => a.trait_type === 'Tag')
      .map(a => a.value.toString())
  }
}