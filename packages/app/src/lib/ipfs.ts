import { PinataSDK } from 'pinata-web3'

let pinata: PinataSDK | null = null

function getPinataClient() {
  if (!pinata && typeof window !== 'undefined') {
    const jwt = process.env.NEXT_PUBLIC_PINATA_JWT || process.env.PINATA_JWT
    const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY
    
    if (!jwt || !gateway) {
      console.warn('Pinata credentials not available on client side')
      return null
    }
    
    pinata = new PinataSDK({
      pinataJwt: jwt,
      pinataGateway: gateway
    })
  }
  return pinata
}

export interface IPFSUploadResult {
  hash: string
  url: string
  size: number
}

export class IPFSClient {
  static async uploadFile(file: File, folder?: string): Promise<IPFSUploadResult> {
    const client = getPinataClient()
    if (!client) {
      throw new Error('Pinata client not available on server side')
    }
    
    try {
      const upload = await client.upload.file(file)
      
      return {
        hash: upload.IpfsHash,
        url: `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${upload.IpfsHash}`,
        size: file.size
      }
    } catch (error) {
      console.error('IPFS upload failed:', error)
      throw new Error('Failed to upload to IPFS')
    }
  }

  static async uploadJSON(data: object, name?: string): Promise<IPFSUploadResult> {
    const client = getPinataClient()
    if (!client) {
      throw new Error('Pinata client not available on server side')
    }
    
    try {
      const upload = await client.upload.json(data).addMetadata({ name })
      
      return {
        hash: upload.IpfsHash,
        url: `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${upload.IpfsHash}`,
        size: JSON.stringify(data).length
      }
    } catch (error) {
      console.error('IPFS JSON upload failed:', error)
      throw new Error('Failed to upload JSON to IPFS')
    }
  }

  static async getFile(hash: string): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${hash}`)
  }

  static async getJSON<T>(hash: string): Promise<T> {
    const response = await this.getFile(hash)
    if (!response.ok) {
      throw new Error(`Failed to fetch IPFS content: ${response.status}`)
    }

    const data = await response.json()
    return data
  }

  static async uploadBeatPackage(audioFile: File, coverImage?: File, metadata?: object): Promise<{
    audioHash: string
    imageHash?: string
    metadataHash?: string
    audioUrl: string
    imageUrl?: string
    metadataUrl?: string
  }> {
    const results: any = {}

    // Upload audio file
    const audioResult = await this.uploadFile(audioFile, 'beats/audio')
    results.audioHash = audioResult.hash
    results.audioUrl = audioResult.url

    // Upload cover image if provided
    if (coverImage) {
      const imageResult = await this.uploadFile(coverImage, 'beats/images')
      results.imageHash = imageResult.hash
      results.imageUrl = imageResult.url
    }

    // Upload metadata if provided
    if (metadata) {
      const metadataResult = await this.uploadJSON(metadata, 'beat-metadata')
      results.metadataHash = metadataResult.hash
      results.metadataUrl = metadataResult.url
    }

    return results
  }

  static getGatewayUrl(hash: string): string {
    return `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${hash}`
  }

  static extractHashFromUrl(url: string): string | null {
    const match = url.match(/\/ipfs\/([a-zA-Z0-9]+)/)
    return match ? match[1] : null
  }
}