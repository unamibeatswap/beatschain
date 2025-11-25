'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAccount, useReadContract, usePublicClient } from 'wagmi'
import { BeatNFTConfig } from '@/contracts/BeatNFT'
import { formatEther } from 'viem'
import { useWeb3BeatsBridge } from '@/hooks/useWeb3BeatsBridge'

// Define Beat type
interface Beat {
  id: string
  tokenId?: string
  title: string
  description: string
  price: number
  genre: string
  bpm: number
  producerId: string
  coverImageUrl: string
  audioUrl?: string
  isActive: boolean
  tags?: string[]
}

interface Web3DataContextType {
  beats: Beat[]
  loading: boolean
  refreshBeats: () => Promise<void>
  communityBeats: Beat[]
  localBeats: Beat[]
}

const Web3DataContext = createContext<Web3DataContextType | undefined>(undefined)

// Metadata API endpoint
const METADATA_API = 'https://api.beatschain.app/metadata'

export function Web3DataProvider({ children }: { children: ReactNode }) {
  const [beats, setBeats] = useState<Beat[]>([])
  const [loading, setLoading] = useState(true)
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { allBeats, communityBeats, localBeats, loading: bridgeLoading, refreshCommunity } = useWeb3BeatsBridge()

  const refreshBeats = async () => {
    setLoading(true)
    try {
      // Fetch beats from blockchain and metadata API
      const beatData = await fetchBeatsData()
      
      // Combine with bridge beats (community + local)
      const combinedBeats = [
        ...beatData,
        ...allBeats.filter(beat => !beatData.some(b => b.id === beat.id))
      ]
      
      setBeats(combinedBeats)
      
      // Refresh community beats
      await refreshCommunity()
    } catch (error) {
      console.error('Failed to fetch beats:', error)
      setBeats(allBeats) // Fallback to bridge beats
    } finally {
      setLoading(false)
    }
  }

  const fetchBeatsData = async (): Promise<Beat[]> => {
    try {
      // Try to fetch from blockchain
      if (publicClient) {
        try {
          // Try to fetch beats by checking token IDs 1-10 (reduce API calls)
          const beatPromises = []
          
          // Check first 10 possible token IDs to reduce errors
          for (let i = 1; i <= 10; i++) {
            beatPromises.push(fetchBeatData(BigInt(i)))
          }
          
          const beatsData = await Promise.all(beatPromises)
          const blockchainBeats = beatsData.filter(Boolean) as Beat[]
          
          if (blockchainBeats.length > 0) {
            console.log(`Found ${blockchainBeats.length} blockchain beats`)
          console.log('Blockchain beats data:', blockchainBeats)
            // Combine blockchain beats with local beats
            const localBeats = getLocalBeats()
            return [...blockchainBeats, ...localBeats]
          }
        } catch (err) {
          console.log('Failed to fetch from blockchain, using local storage')
        }
      }
      
      // Fallback to local storage
      return getLocalBeats()
    } catch (error) {
      console.error('Error in fetchBeatsData:', error)
      return getLocalBeats()
    }
  }

  const fetchBeatData = async (tokenId: bigint): Promise<Beat | null> => {
    try {
      // Get beat data from contract
      const beatData = await publicClient?.readContract({
        address: BeatNFTConfig.address[11155111] as `0x${string}`,
        abi: BeatNFTConfig.abi,
        functionName: 'beats',
        args: [tokenId]
      })
      
      if (!beatData || beatData[1] === '0x0000000000000000000000000000000000000000') return null
      
      // Get token URI
      const tokenUri = await publicClient?.readContract({
        address: BeatNFTConfig.address[11155111] as `0x${string}`,
        abi: BeatNFTConfig.abi,
        functionName: 'tokenURI',
        args: [tokenId]
      }) as string
      
      // Fetch metadata
      let metadata
      try {
        const response = await fetch(tokenUri)
        metadata = await response.json()
      } catch (err) {
        // If metadata fetch fails, use local storage or defaults
        const localMetadata = localStorage.getItem(`beat_metadata_${tokenId.toString()}`)
        metadata = localMetadata ? JSON.parse(localMetadata) : {
          name: `Beat #${tokenId}`,
          description: 'No description available',
          image: 'https://placehold.co/400x400/purple/white?text=Beat',
          audio: '',
          attributes: []
        }
      }
      
      // Extract data from contract and metadata
      const price = formatEther(beatData[0] as bigint)
      const producer = beatData[1] as string
      const isForSale = beatData[3] as boolean
      const genre = beatData[4] as string
      const bpm = Number(beatData[5])
      
      // Build beat object
      return {
        id: tokenId.toString(),
        tokenId: tokenId.toString(),
        title: metadata.name,
        description: metadata.description,
        price: parseFloat(price),
        genre,
        bpm,
        producerId: producer,
        coverImageUrl: metadata.image,
        audioUrl: metadata.audio,
        isActive: isForSale,
        tags: metadata.attributes?.filter(attr => attr.trait_type === 'tag').map(attr => attr.value) || []
      }
    } catch (error) {
      // Silently handle non-existent tokens (expected for most IDs)
      return null
    }
  }

  const getLocalBeats = (): Beat[] => {
    try {
      // Get all producer beats from localStorage
      const allBeats: Beat[] = []
      
      // Get beats from all producers
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('producer_beats_')) {
          const beatsStr = localStorage.getItem(key)
          if (beatsStr) {
            const producerBeats = JSON.parse(beatsStr)
            allBeats.push(...producerBeats)
          }
        }
      }
      
      // Also check legacy beats_data key
      const legacyBeatsStr = localStorage.getItem('beats_data')
      if (legacyBeatsStr) {
        const legacyBeats = JSON.parse(legacyBeatsStr)
        allBeats.push(...legacyBeats)
      }
      
      console.log('Local beats found:', allBeats.length)
      console.log('Local beats data:', allBeats)
      
      // Convert date strings to Date objects for compatibility
      const processedBeats = allBeats.map(beat => ({
        ...beat,
        createdAt: beat.createdAt ? new Date(beat.createdAt) : new Date(),
        updatedAt: beat.updatedAt ? new Date(beat.updatedAt) : new Date()
      }))
      
      return processedBeats
    } catch (error) {
      console.error('Error getting local beats:', error)
      return []
    }
  }

  useEffect(() => {
    refreshBeats()
  }, [address, allBeats.length])
  
  // Update beats when bridge data changes
  useEffect(() => {
    if (!bridgeLoading && allBeats.length > 0) {
      setBeats(prevBeats => {
        const blockchainBeats = prevBeats.filter(beat => beat.tokenId)
        const combinedBeats = [
          ...blockchainBeats,
          ...allBeats.filter(beat => !blockchainBeats.some(b => b.id === beat.id))
        ]
        return combinedBeats
      })
    }
  }, [allBeats, bridgeLoading])
  
  // Expose beats data globally for adapters to access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__WEB3_DATA_CONTEXT__ = { beats, loading }
    }
  }, [beats, loading])

  return (
    <Web3DataContext.Provider value={{ 
      beats, 
      loading: loading || bridgeLoading, 
      refreshBeats,
      communityBeats,
      localBeats
    }}>
      {children}
    </Web3DataContext.Provider>
  )
}

export function useWeb3Data() {
  const context = useContext(Web3DataContext)
  if (context === undefined) {
    console.warn('useWeb3Data must be used within a Web3DataProvider')
    return {
      beats: [],
      loading: false,
      refreshBeats: async () => {},
      communityBeats: [],
      localBeats: []
    }
  }
  return context
}