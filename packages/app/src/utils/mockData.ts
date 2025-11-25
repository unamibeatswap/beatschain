import { Beat, UserProfile } from '@/types'

export const MOCK_BEATS: Beat[] = [
  {
    id: 'beat-1',
    title: 'Amapiano Fire',
    description: 'Hot amapiano beat with deep basslines and smooth piano melodies',
    producerId: 'producer-1',
    audioUrl: '/audio/amapiano-fire.mp3',
    coverImageUrl: '/images/amapiano-cover.jpg',
    price: 299.99,
    genre: 'amapiano',
    bpm: 112,
    key: 'C minor',
    tags: ['amapiano', 'piano', 'bass', 'south african'],
    isNFT: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'beat-2',
    title: 'Afrobeats Groove',
    description: 'Infectious afrobeats rhythm with traditional percussion',
    producerId: 'producer-2',
    audioUrl: '/audio/afrobeats-groove.mp3',
    coverImageUrl: '/images/afrobeats-cover.jpg',
    price: 249.99,
    genre: 'afrobeats',
    bpm: 102,
    key: 'F major',
    tags: ['afrobeats', 'percussion', 'groove', 'african'],
    isNFT: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'beat-3',
    title: 'Trap Banger',
    description: 'Hard-hitting trap beat with 808s and crisp hi-hats',
    producerId: 'producer-1',
    audioUrl: '/audio/trap-banger.mp3',
    coverImageUrl: '/images/trap-cover.jpg',
    price: 399.99,
    genre: 'trap',
    bpm: 140,
    key: 'G minor',
    tags: ['trap', '808', 'hard', 'banger'],
    isNFT: true,
    tokenId: 1,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
]

export const MOCK_USERS: UserProfile[] = [
  {
    uid: 'producer-1',
    email: 'beatmaster@example.com',
    displayName: 'Beat Master',
    role: 'producer',
    isVerified: true,
    createdAt: new Date('2024-01-01')
  },
  {
    uid: 'producer-2',
    email: 'djpro@example.com',
    displayName: 'DJ Pro',
    role: 'producer',
    isVerified: true,
    createdAt: new Date('2024-01-05')
  }
]

export const MOCK_STATS = {
  overview: {
    totalUsers: 25,
    totalBeats: 47,
    totalPurchases: 156,
    totalRevenue: 12450.75,
    activeProducers: 8
  },
  users: {
    byRole: { user: 15, producer: 8, admin: 2 },
    recentSignups: 5
  },
  beats: {
    byGenre: {
      amapiano: 18,
      afrobeats: 12,
      trap: 10,
      house: 7
    },
    recentUploads: 12
  },
  revenue: {
    total: 12450.75,
    averagePerSale: 79.81,
    monthlyGrowth: 23
  }
}

export const MOCK_PRODUCER_STATS = {
  totalEarnings: 2450.75,
  totalSales: 12,
  totalPlays: 1847,
  monthlyEarnings: 735.23,
  totalBeats: 3
}