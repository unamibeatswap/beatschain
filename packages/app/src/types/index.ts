// User Types
export interface UserProfile {
  uid: string
  email: string
  displayName: string
  role: 'user' | 'producer' | 'admin' | 'creator' // ✅ Added creator role
  walletAddress?: string
  profileImage?: string
  isVerified: boolean
  creatorProfile?: ContentCreator // ✅ Optional creator profile
  createdAt: Date
}

// Beat Types
export interface Beat {
  id: string
  beatNftId?: string // ✅ BeatNFT™ identifier (Phase 4E)
  title: string
  description?: string
  producerId: string
  producerName?: string
  stageName?: string // Producer's stage/artist name
  audioUrl: string
  coverImageUrl?: string
  price: number
  genre: string
  bpm: number
  key: string
  tags?: string[]
  isNFT: boolean
  tokenId?: number | string
  contractAddress?: string
  royaltyPercentage?: number
  isActive?: boolean
  status?: string
  createdAt?: Date
  updatedAt?: Date
}

// Purchase Types
export interface Purchase {
  id: string
  beatId: string // Legacy field for backward compatibility
  beatNftId: string // ✅ BeatNFT™ identifier (Phase 4E)
  buyerId: string
  producerId: string
  amount: number
  licenseType: 'basic' | 'premium' | 'exclusive'
  transactionHash?: string
  createdAt: Date
}

// License Types
export interface License {
  type: 'basic' | 'premium' | 'exclusive'
  price: number
  description: string
  allowCommercialUse: boolean
  allowDistribution: boolean
  maxCopies?: number
}

// Site Settings Types
export interface SiteSettings {
  siteName: string
  siteDescription: string
  gtmId?: string
  logo?: string
  socialMedia?: {
    twitter?: string
    instagram?: string
    youtube?: string
  }
  cmsEnabled?: boolean
  sanityProjectId?: string
  sanityDataset?: string
}

// Phase 4E: Creator Revenue Models
export interface CreatorRevenueModel {
  standard: { producer: number; creator: number; platform: number }
  premium: { producer: number; creator: number; platform: number }
  exclusive: { producer: number; creator: number; platform: number }
  custom: { producer: 'negotiable'; creator: 'negotiable'; platform: 15 }
}

export const CREATOR_REVENUE_MODELS: CreatorRevenueModel = {
  standard: { producer: 60, creator: 25, platform: 15 },
  premium: { producer: 50, creator: 35, platform: 15 },
  exclusive: { producer: 40, creator: 45, platform: 15 },
  custom: { producer: 'negotiable', creator: 'negotiable', platform: 15 }
}

// Activity Types
export interface Activity {
  type: 'purchase' | 'mint' | 'transfer'
  user: string
  beatId: string
  amount?: string
  timestamp: Date
}

// Producer Stats Types
export interface ProducerActivity {
  type: 'sale' | 'mint' | 'royalty'
  beatId: string
  amount?: string
  timestamp: Date
}

// Phase 4E: Content Creator Types
export interface ContentCreator {
  walletAddress: string // Web3-native identity
  creatorType: 'youtuber' | 'tiktoker' | 'podcaster' | 'filmmaker' | 'gamedev' | 'streamer'
  platformConnections: {
    patreon?: { creatorId: string; subscribers: number; monthlyRevenue: number }
    youtube?: { channelId: string; subscribers: number; verified: boolean }
    tiktok?: { username: string; followers: number; verified: boolean }
    twitch?: { username: string; followers: number; verified: boolean }
    instagram?: { username: string; followers: number; verified: boolean }
  }
  verificationTier: 'bronze' | 'silver' | 'gold' | 'platinum'
  audienceSize: number
  isVerified: boolean
  negotiationHistory: NegotiationRecord[]
  createdAt: Date
  updatedAt: Date
}

export interface BeatNFTLicense {
  id: string
  beatNftId: string // ✅ BeatNFT™ identifier
  creatorId: string
  producerId: string
  negotiatedPrice: number
  creatorRoyaltyShare: number // 10-90% negotiable
  platformFee: number // Always 15%
  licenseType: 'personal' | 'commercial' | 'sync' | 'exclusive'
  terms: LicenseTerms
  status: 'pending' | 'accepted' | 'rejected' | 'active' | 'expired'
  transactionHash?: string
  createdAt: Date
  acceptedAt?: Date
}

export interface NegotiationRecord {
  id: string
  beatNftId: string
  proposedPrice: number
  proposedRoyaltyShare: number
  message?: string
  status: 'pending' | 'accepted' | 'rejected' | 'countered'
  createdAt: Date
}

export interface LicenseTerms {
  duration: number // months
  territory: 'worldwide' | 'regional' | string[]
  exclusivity: boolean
  commercialUse: boolean
  syncRights: boolean
  resaleRights: boolean
  creditRequired: boolean
}