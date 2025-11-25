import { publicClient, BEAT_NFT_EVENTS } from '@/utils/web3Events'
import { MetadataManager, OnChainBeatData, DecentralizedBeat } from './metadata'

export interface IndexedEvent {
  id: string
  type: 'mint' | 'purchase' | 'transfer' | 'royalty'
  tokenId: string
  blockNumber: bigint
  txHash: string
  timestamp: Date
  data: any
}

export class EventIndexer {
  private static readonly STORAGE_KEY = 'web3-beat-index'
  private static readonly EVENTS_KEY = 'web3-events-index'
  
  static async indexContractEvents(contractAddress: string, fromBlock?: bigint): Promise<void> {
    try {
      const currentBlock = await publicClient.getBlockNumber()
      const startBlock = fromBlock || currentBlock - 1000n // Last ~1000 blocks
      
      // Index all relevant events
      await Promise.all([
        this.indexMintEvents(contractAddress, startBlock, currentBlock),
        this.indexPurchaseEvents(contractAddress, startBlock, currentBlock),
        this.indexTransferEvents(contractAddress, startBlock, currentBlock)
      ])
      
      console.log('Event indexing completed')
    } catch (error) {
      console.error('Event indexing failed:', error)
    }
  }

  private static async indexMintEvents(address: string, fromBlock: bigint, toBlock: bigint) {
    const logs = await publicClient.getLogs({
      address: address as `0x${string}`,
      event: BEAT_NFT_EVENTS.BeatMinted,
      fromBlock,
      toBlock
    })

    const events: IndexedEvent[] = logs.map(log => ({
      id: `mint-${log.transactionHash}-${log.logIndex}`,
      type: 'mint',
      tokenId: log.args.tokenId?.toString() || '',
      blockNumber: log.blockNumber,
      txHash: log.transactionHash,
      timestamp: new Date(),
      data: {
        producer: log.args.producer,
        uri: log.args.uri
      }
    }))

    this.storeEvents(events)
  }

  private static async indexPurchaseEvents(address: string, fromBlock: bigint, toBlock: bigint) {
    const logs = await publicClient.getLogs({
      address: address as `0x${string}`,
      event: BEAT_NFT_EVENTS.BeatPurchased,
      fromBlock,
      toBlock
    })

    const events: IndexedEvent[] = logs.map(log => ({
      id: `purchase-${log.transactionHash}-${log.logIndex}`,
      type: 'purchase',
      tokenId: log.args.tokenId?.toString() || '',
      blockNumber: log.blockNumber,
      txHash: log.transactionHash,
      timestamp: new Date(),
      data: {
        buyer: log.args.buyer,
        seller: log.args.seller,
        price: log.args.price?.toString()
      }
    }))

    this.storeEvents(events)
  }

  private static async indexTransferEvents(address: string, fromBlock: bigint, toBlock: bigint) {
    const logs = await publicClient.getLogs({
      address: address as `0x${string}`,
      event: BEAT_NFT_EVENTS.Transfer,
      fromBlock,
      toBlock
    })

    const events: IndexedEvent[] = logs.map(log => ({
      id: `transfer-${log.transactionHash}-${log.logIndex}`,
      type: 'transfer',
      tokenId: log.args.tokenId?.toString() || '',
      blockNumber: log.blockNumber,
      txHash: log.transactionHash,
      timestamp: new Date(),
      data: {
        from: log.args.from,
        to: log.args.to
      }
    }))

    this.storeEvents(events)
  }

  static storeEvents(events: IndexedEvent[]): void {
    if (typeof window === 'undefined') return
    
    try {
      const existing = this.getStoredEvents()
      const combined = [...events, ...existing]
      const unique = combined.filter((event, index, arr) => 
        arr.findIndex(e => e.id === event.id) === index
      )
      
      localStorage.setItem(this.EVENTS_KEY, JSON.stringify(unique.slice(0, 1000)))
    } catch (error) {
      console.warn('Failed to store events:', error)
    }
  }

  static getStoredEvents(): IndexedEvent[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(this.EVENTS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.warn('Failed to retrieve stored events:', error)
      return []
    }
  }

  static getEventsByTokenId(tokenId: string): IndexedEvent[] {
    return this.getStoredEvents().filter(event => event.tokenId === tokenId)
  }

  static getEventsByType(type: IndexedEvent['type']): IndexedEvent[] {
    return this.getStoredEvents().filter(event => event.type === type)
  }

  static async buildBeatIndex(contractAddress: string): Promise<DecentralizedBeat[]> {
    const beats: DecentralizedBeat[] = []
    const mintEvents = this.getEventsByType('mint')
    
    for (const mintEvent of mintEvents) {
      try {
        const onChainData: OnChainBeatData = {
          tokenId: mintEvent.tokenId,
          producer: mintEvent.data.producer,
          price: '0', // Will be updated from contract
          royaltyPercentage: 0, // Will be updated from contract
          isActive: true,
          metadataURI: mintEvent.data.uri
        }
        
        const beat = await MetadataManager.combineBeatData(onChainData)
        beats.push(beat)
      } catch (error) {
        console.warn(`Failed to process beat ${mintEvent.tokenId}:`, error)
      }
    }
    
    this.storeBeatIndex(beats)
    return beats
  }

  static storeBeatIndex(beats: DecentralizedBeat[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(beats))
    } catch (error) {
      console.warn('Failed to store beat index:', error)
    }
  }

  static getStoredBeatIndex(): DecentralizedBeat[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.warn('Failed to retrieve beat index:', error)
      return []
    }
  }
}