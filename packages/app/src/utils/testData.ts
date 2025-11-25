export interface TestBeat {
  id: string
  title: string
  description: string
  genre: string
  bpm: number
  key: string
  tags: string[]
  price: number
  audioUrl: string
  coverImageUrl: string
  producerId: string
  producerName: string
  createdAt: Date
  updatedAt: Date
  status: 'active' | 'pending' | 'rejected'
  plays: number
  likes: number
  tokenId?: number
  royaltyPercentage: number
  isActive: boolean
}

export interface TestProducer {
  id: string
  name: string
  displayName: string
  bio: string
  profileImage: string
  location: string
  genres: string[]
  totalBeats: number
  totalSales: number
  totalEarnings: number
  followers: number
  isVerified: boolean
  joinedAt: Date
  socialLinks: {
    twitter?: string
    instagram?: string
    soundcloud?: string
  }
}

export interface TestUser {
  id: string
  email: string
  displayName: string
  role: 'user' | 'producer' | 'admin'
  isVerified: boolean
  profileImage?: string
  createdAt: Date
  lastActive: Date
  totalPurchases: number
  totalSpent: number
}

export const TEST_BEATS: TestBeat[] = [
  {
    id: 'beat-1',
    title: 'Dark Trap Vibes',
    description: 'Hard-hitting trap beat with dark atmospheric elements',
    genre: 'Trap',
    bpm: 140,
    key: 'F# Minor',
    tags: ['dark', 'trap', 'hard', 'atmospheric'],
    price: 0.05, // ETH
    audioUrl: '/audio/demo-beat-1.mp3',
    coverImageUrl: '/images/beat-covers/dark-trap.jpg',
    producerId: 'producer-1',
    producerName: 'BeatMaker SA',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    status: 'active',
    plays: 1250,
    likes: 89,
    tokenId: 1,
    royaltyPercentage: 5,
    isActive: true
  },
  {
    id: 'beat-2',
    title: 'Amapiano Groove',
    description: 'Smooth amapiano beat with classic log drum patterns',
    genre: 'Amapiano',
    bpm: 112,
    key: 'C Major',
    tags: ['amapiano', 'smooth', 'groove', 'south african'],
    price: 0.08, // ETH
    audioUrl: '/audio/demo-beat-2.mp3',
    coverImageUrl: '/images/beat-covers/amapiano-groove.jpg',
    producerId: 'producer-2',
    producerName: 'Piano King',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    status: 'active',
    plays: 2100,
    likes: 156,
    tokenId: 2,
    royaltyPercentage: 7,
    isActive: true
  },
  {
    id: 'beat-3',
    title: 'Afrobeats Fire',
    description: 'Energetic afrobeats with traditional percussion elements',
    genre: 'Afrobeats',
    bpm: 128,
    key: 'G Minor',
    tags: ['afrobeats', 'energetic', 'percussion', 'fire'],
    price: 0.06, // ETH
    audioUrl: '/audio/demo-beat-3.mp3',
    coverImageUrl: '/images/beat-covers/afrobeats-fire.jpg',
    producerId: 'producer-3',
    producerName: 'Afro Producer',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    status: 'pending',
    plays: 890,
    likes: 67,
    royaltyPercentage: 6,
    isActive: false
  },
  {
    id: 'beat-4',
    title: 'Hip Hop Classic',
    description: 'Old school hip hop with vinyl samples and boom bap drums',
    genre: 'Hip Hop',
    bpm: 95,
    key: 'A Minor',
    tags: ['hip hop', 'old school', 'boom bap', 'vinyl'],
    price: 0.04, // ETH
    audioUrl: '/audio/demo-beat-4.mp3',
    coverImageUrl: '/images/beat-covers/hip-hop-classic.jpg',
    producerId: 'producer-1',
    producerName: 'BeatMaker SA',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    status: 'active',
    plays: 1680,
    likes: 124,
    tokenId: 3,
    royaltyPercentage: 5,
    isActive: true
  },
  {
    id: 'beat-5',
    title: 'House Anthem',
    description: 'Deep house beat with soulful vocals and piano chords',
    genre: 'House',
    bpm: 124,
    key: 'D Major',
    tags: ['house', 'deep', 'soulful', 'piano'],
    price: 0.07, // ETH
    audioUrl: '/audio/demo-beat-5.mp3',
    coverImageUrl: '/images/beat-covers/house-anthem.jpg',
    producerId: 'producer-4',
    producerName: 'House Master',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    status: 'active',
    plays: 945,
    likes: 78,
    tokenId: 4,
    royaltyPercentage: 8,
    isActive: true
  }
]

export const TEST_PRODUCERS: TestProducer[] = [
  {
    id: 'producer-1',
    name: 'BeatMaker SA',
    displayName: 'BeatMaker SA',
    bio: 'South African producer specializing in trap and hip hop beats. 5+ years experience.',
    profileImage: '/images/producers/beatmaker-sa.jpg',
    location: 'Cape Town, South Africa',
    genres: ['Trap', 'Hip Hop', 'R&B'],
    totalBeats: 23,
    totalSales: 156,
    totalEarnings: 8.45,
    followers: 1250,
    isVerified: true,
    joinedAt: new Date('2023-08-15'),
    socialLinks: {
      twitter: '@beatmakersa',
      instagram: '@beatmaker_sa',
      soundcloud: 'beatmaker-sa'
    }
  },
  {
    id: 'producer-2',
    name: 'Piano King',
    displayName: 'Piano King',
    bio: 'Amapiano specialist from Johannesburg. Creating the smoothest piano-driven beats.',
    profileImage: '/images/producers/piano-king.jpg',
    location: 'Johannesburg, South Africa',
    genres: ['Amapiano', 'House', 'Afrobeats'],
    totalBeats: 18,
    totalSales: 89,
    totalEarnings: 12.3,
    followers: 890,
    isVerified: true,
    joinedAt: new Date('2023-09-20'),
    socialLinks: {
      instagram: '@piano_king_sa',
      soundcloud: 'piano-king-beats'
    }
  },
  {
    id: 'producer-3',
    name: 'Afro Producer',
    displayName: 'Afro Producer',
    bio: 'Bringing authentic African sounds to the global stage. Traditional meets modern.',
    profileImage: '/images/producers/afro-producer.jpg',
    location: 'Lagos, Nigeria',
    genres: ['Afrobeats', 'Afro House', 'Traditional'],
    totalBeats: 15,
    totalSales: 67,
    totalEarnings: 6.8,
    followers: 567,
    isVerified: false,
    joinedAt: new Date('2023-11-10'),
    socialLinks: {
      twitter: '@afroproducer',
      instagram: '@afro_producer_ng'
    }
  },
  {
    id: 'producer-4',
    name: 'House Master',
    displayName: 'House Master',
    bio: 'Deep house and soulful house producer. Creating music for the dance floor.',
    profileImage: '/images/producers/house-master.jpg',
    location: 'Durban, South Africa',
    genres: ['House', 'Deep House', 'Soulful House'],
    totalBeats: 12,
    totalSales: 45,
    totalEarnings: 4.2,
    followers: 423,
    isVerified: false,
    joinedAt: new Date('2023-12-05'),
    socialLinks: {
      soundcloud: 'house-master-sa'
    }
  }
]

export const TEST_USERS: TestUser[] = [
  {
    id: 'user-1',
    email: 'admin@beatschain.app',
    displayName: 'Admin User',
    role: 'admin',
    isVerified: true,
    profileImage: '/images/users/admin.jpg',
    createdAt: new Date('2023-06-01'),
    lastActive: new Date(),
    totalPurchases: 0,
    totalSpent: 0
  },
  {
    id: 'user-2',
    email: 'artist1@example.com',
    displayName: 'MC Flow',
    role: 'user',
    isVerified: true,
    profileImage: '/images/users/mc-flow.jpg',
    createdAt: new Date('2023-10-15'),
    lastActive: new Date('2024-02-10'),
    totalPurchases: 12,
    totalSpent: 0.68
  },
  {
    id: 'user-3',
    email: 'singer@example.com',
    displayName: 'Vocal Queen',
    role: 'user',
    isVerified: false,
    createdAt: new Date('2023-11-20'),
    lastActive: new Date('2024-02-08'),
    totalPurchases: 8,
    totalSpent: 0.45
  },
  {
    id: 'user-4',
    email: 'newartist@example.com',
    displayName: 'Rising Star',
    role: 'user',
    isVerified: false,
    createdAt: new Date('2024-01-10'),
    lastActive: new Date('2024-02-09'),
    totalPurchases: 3,
    totalSpent: 0.18
  }
]

export class TestDataManager {
  static initializeTestData() {
    // Store test data in localStorage
    localStorage.setItem('test_beats', JSON.stringify(TEST_BEATS))
    localStorage.setItem('test_producers', JSON.stringify(TEST_PRODUCERS))
    localStorage.setItem('test_users', JSON.stringify(TEST_USERS))
    
    // Create admin user profile
    const adminProfile = {
      address: '0x1234567890123456789012345678901234567890',
      displayName: 'Admin User',
      bio: 'Platform administrator',
      isVerified: true,
      role: 'admin',
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date()
    }
    localStorage.setItem('web3_profile_0x1234567890123456789012345678901234567890', JSON.stringify(adminProfile))
    
    console.log('✅ Test data initialized successfully!')
  }

  static getTestBeats(): TestBeat[] {
    const stored = localStorage.getItem('test_beats')
    return stored ? JSON.parse(stored) : TEST_BEATS
  }

  static getTestProducers(): TestProducer[] {
    const stored = localStorage.getItem('test_producers')
    return stored ? JSON.parse(stored) : TEST_PRODUCERS
  }

  static getTestUsers(): TestUser[] {
    const stored = localStorage.getItem('test_users')
    return stored ? JSON.parse(stored) : TEST_USERS
  }

  static addTestBeat(beat: Omit<TestBeat, 'id' | 'createdAt' | 'updatedAt'>): TestBeat {
    const beats = this.getTestBeats()
    const newBeat: TestBeat = {
      ...beat,
      id: `beat-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    beats.push(newBeat)
    localStorage.setItem('test_beats', JSON.stringify(beats))
    return newBeat
  }

  static updateBeatStatus(beatId: string, status: TestBeat['status']): boolean {
    const beats = this.getTestBeats()
    const beatIndex = beats.findIndex(b => b.id === beatId)
    if (beatIndex === -1) return false
    
    beats[beatIndex].status = status
    beats[beatIndex].updatedAt = new Date()
    localStorage.setItem('test_beats', JSON.stringify(beats))
    return true
  }

  static getAdminStats() {
    const beats = this.getTestBeats()
    const users = this.getTestUsers()
    const producers = this.getTestProducers()
    
    return {
      totalUsers: users.length + producers.length,
      totalBeats: beats.length,
      totalRevenue: beats.reduce((sum, beat) => sum + (beat.price * beat.plays * 0.001), 0),
      pendingReviews: beats.filter(b => b.status === 'pending').length,
      activeProducers: producers.length,
      monthlyGrowth: 23.5
    }
  }

  static clearTestData() {
    localStorage.removeItem('test_beats')
    localStorage.removeItem('test_producers')
    localStorage.removeItem('test_users')
    console.log('🗑️ Test data cleared')
  }
}