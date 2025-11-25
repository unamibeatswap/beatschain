import { createPublicClient, http, parseAbiItem } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

// Create public client for reading blockchain data
export const publicClient = createPublicClient({
  chain: process.env.NODE_ENV === 'production' ? mainnet : sepolia,
  transport: http(process.env.NEXT_PUBLIC_INFURA_KEY 
    ? `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`
    : undefined
  )
})

// Contract ABI events
export const BEAT_NFT_EVENTS = {
  BeatPurchased: parseAbiItem('event BeatPurchased(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price)'),
  BeatMinted: parseAbiItem('event BeatMinted(uint256 indexed tokenId, address indexed producer, string uri)'),
  Transfer: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
  RoyaltyPaid: parseAbiItem('event RoyaltyPaid(uint256 indexed tokenId, address indexed recipient, uint256 amount)')
}

// Event processing utilities
export const processWeb3Event = (log: any, eventType: string) => {
  const baseEvent = {
    txHash: log.transactionHash,
    blockNumber: log.blockNumber,
    timestamp: new Date(),
    eventType
  }

  switch (eventType) {
    case 'BeatPurchased':
      return {
        ...baseEvent,
        tokenId: log.args.tokenId?.toString(),
        buyer: log.args.buyer,
        seller: log.args.seller,
        price: log.args.price?.toString(),
        type: 'purchase' as const,
        title: '🎵 Beat Purchased!',
        message: `Beat #${log.args.tokenId} sold for ${log.args.price} ETH`
      }

    case 'BeatMinted':
      return {
        ...baseEvent,
        tokenId: log.args.tokenId?.toString(),
        producer: log.args.producer,
        uri: log.args.uri,
        type: 'mint' as const,
        title: '✨ New Beat Minted!',
        message: `Beat #${log.args.tokenId} has been minted as NFT`
      }

    case 'Transfer':
      return {
        ...baseEvent,
        tokenId: log.args.tokenId?.toString(),
        from: log.args.from,
        to: log.args.to,
        type: 'transfer' as const,
        title: '🔄 Beat Transferred',
        message: `Beat #${log.args.tokenId} transferred to new owner`
      }

    case 'RoyaltyPaid':
      return {
        ...baseEvent,
        tokenId: log.args.tokenId?.toString(),
        recipient: log.args.recipient,
        amount: log.args.amount?.toString(),
        type: 'royalty' as const,
        title: '💰 Royalty Received!',
        message: `Received ${log.args.amount} ETH royalty for Beat #${log.args.tokenId}`
      }

    default:
      return baseEvent
  }
}

// Notification formatting (disabled to prevent persistent notifications)
export const formatNotificationMessage = (event: any) => {
  // Temporarily disabled to prevent persistent toast notifications
  return null
}

// Email notification templates (for future implementation)
export const EMAIL_TEMPLATES = {
  purchase: {
    subject: 'Beat Sold - Payment Received!',
    template: (data: any) => `
      <h2>Congratulations! Your beat has been sold</h2>
      <p>Beat #${data.tokenId} has been purchased for ${data.price} ETH</p>
      <p>Transaction: ${data.txHash}</p>
    `
  },
  royalty: {
    subject: 'Royalty Payment Received',
    template: (data: any) => `
      <h2>Royalty Payment Received</h2>
      <p>You received ${data.amount} ETH in royalties for Beat #${data.tokenId}</p>
      <p>Transaction: ${data.txHash}</p>
    `
  }
}