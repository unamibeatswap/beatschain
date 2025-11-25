import { collection, doc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface SeedUser {
  uid: string
  email: string
  displayName: string
  role: 'user' | 'producer' | 'admin'
  isVerified: boolean
  profileImage?: string
  bio?: string
  walletAddress?: string
  createdAt: Date
  updatedAt: Date
  lastActive: Date
  totalSpent: number
  totalEarned: number
}

export interface SeedBeat {
  id: string
  title: string
  description: string
  producerId: string
  audioUrl: string
  coverImageUrl?: string
  price: number
  genre: string
  bpm: number
  key: string
  tags: string[]
  isNFT: boolean
  createdAt: Date
  updatedAt: Date
}

const seedUsers: SeedUser[] = [
  {
    uid: 'producer-1',
    email: 'producer1@example.com',
    displayName: 'Beat Master',
    role: 'producer',
    isVerified: true,
    bio: 'Professional Amapiano producer from Johannesburg. Creating fire beats since 2020.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    lastActive: new Date('2024-01-25'),
    totalSpent: 0,
    totalEarned: 12500.00
  },
  {
    uid: 'user-1',
    email: 'user1@example.com',
    displayName: 'Music Lover',
    role: 'user',
    isVerified: false,
    bio: 'Hip-hop enthusiast and beat collector.',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    lastActive: new Date('2024-01-24'),
    totalSpent: 899.99,
    totalEarned: 0
  },
  {
    uid: 'admin-1',
    email: 'admin@beatschain.app',
    displayName: 'Admin User',
    role: 'admin',
    isVerified: true,
    bio: 'Platform administrator',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastActive: new Date(),
    totalSpent: 0,
    totalEarned: 0
  }
]

const seedBeats: SeedBeat[] = [
  {
    id: 'beat-1',
    title: 'Amapiano Fire',
    description: 'Hot amapiano beat with deep basslines and catchy melodies. Perfect for vocals and commercial use.',
    producerId: 'producer-1',
    audioUrl: '/audio/sample1.mp3',
    coverImageUrl: 'https://via.placeholder.com/300x300/667eea/ffffff?text=Amapiano+Fire',
    price: 299.99,
    genre: 'amapiano',
    bpm: 112,
    key: 'Am',
    tags: ['amapiano', 'fire', 'deep', 'commercial'],
    isNFT: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'beat-2',
    title: 'Afrobeats Groove',
    description: 'Smooth afrobeats rhythm with traditional African percussion and modern production.',
    producerId: 'producer-1',
    audioUrl: '/audio/sample2.mp3',
    coverImageUrl: 'https://via.placeholder.com/300x300/764ba2/ffffff?text=Afrobeats+Groove',
    price: 249.99,
    genre: 'afrobeats',
    bpm: 102,
    key: 'C',
    tags: ['afrobeats', 'smooth', 'groove', 'percussion'],
    isNFT: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'beat-3',
    title: 'Trap Banger',
    description: 'Hard hitting trap beat with heavy 808s and crisp hi-hats. Ready for rap vocals.',
    producerId: 'producer-1',
    audioUrl: '/audio/sample3.mp3',
    coverImageUrl: 'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=Trap+Banger',
    price: 399.99,
    genre: 'trap',
    bpm: 140,
    key: 'Gm',
    tags: ['trap', 'hard', 'banger', '808s'],
    isNFT: false,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'beat-4',
    title: 'Gqom Energy',
    description: 'High-energy Gqom beat with traditional South African elements and modern club sound.',
    producerId: 'producer-1',
    audioUrl: '/audio/sample4.mp3',
    coverImageUrl: 'https://via.placeholder.com/300x300/ff6b6b/ffffff?text=Gqom+Energy',
    price: 199.99,
    genre: 'gqom',
    bpm: 130,
    key: 'Dm',
    tags: ['gqom', 'energy', 'club', 'south african'],
    isNFT: false,
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28')
  }
]

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...')
    
    // Seed users
    console.log('Seeding users...')
    for (const user of seedUsers) {
      const userDoc = doc(db, 'users', user.uid)
      await setDoc(userDoc, {
        ...user,
        createdAt: Timestamp.fromDate(user.createdAt),
        updatedAt: Timestamp.fromDate(user.updatedAt),
        lastActive: Timestamp.fromDate(user.lastActive)
      })
      console.log(`✅ Seeded user: ${user.displayName}`)
    }
    
    // Seed beats
    console.log('Seeding beats...')
    for (const beat of seedBeats) {
      const beatDoc = doc(db, 'beats', beat.id)
      await setDoc(beatDoc, {
        ...beat,
        createdAt: Timestamp.fromDate(beat.createdAt),
        updatedAt: Timestamp.fromDate(beat.updatedAt)
      })
      console.log(`✅ Seeded beat: ${beat.title}`)
    }
    
    console.log('✅ Database seeding completed successfully!')
    return { success: true, message: 'Database seeded successfully' }
  } catch (error: any) {
    console.error('❌ Error seeding database:', error)
    return { success: false, message: error.message }
  }
}

export async function clearDatabase() {
  try {
    console.log('⚠️ This would clear the database in a real implementation')
    console.log('For safety, this is not implemented in the demo')
    return { success: true, message: 'Database clear simulated' }
  } catch (error: any) {
    console.error('❌ Error clearing database:', error)
    return { success: false, message: error.message }
  }
}