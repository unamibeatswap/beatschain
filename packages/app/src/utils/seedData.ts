import { adminDb } from '@/lib/firebase-admin'
import { Beat, UserProfile } from '@/types'

const SEED_USERS: Omit<UserProfile, 'uid'>[] = [
  {
    email: 'beatmaster@beatschain.app',
    displayName: 'Beat Master',
    role: 'producer',
    isVerified: true,
    createdAt: new Date('2024-01-01')
  },
  {
    email: 'djpro@beatschain.app',
    displayName: 'DJ Pro',
    role: 'producer',
    isVerified: true,
    createdAt: new Date('2024-01-05')
  },
  {
    email: 'musiclover@beatschain.app',
    displayName: 'Music Lover',
    role: 'user',
    isVerified: false,
    createdAt: new Date('2024-01-10')
  }
]

const SEED_BEATS: Omit<Beat, 'id'>[] = [
  {
    title: 'Amapiano Fire',
    description: 'Hot amapiano beat with deep basslines and smooth piano melodies',
    producerId: 'producer-1',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImageUrl: 'https://via.placeholder.com/400x400/667eea/ffffff?text=Amapiano+Fire',
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
    title: 'Afrobeats Groove',
    description: 'Infectious afrobeats rhythm with traditional percussion',
    producerId: 'producer-2',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImageUrl: 'https://via.placeholder.com/400x400/764ba2/ffffff?text=Afrobeats+Groove',
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
    title: 'Trap Banger',
    description: 'Hard-hitting trap beat with 808s and crisp hi-hats',
    producerId: 'producer-1',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImageUrl: 'https://via.placeholder.com/400x400/f093fb/ffffff?text=Trap+Banger',
    price: 399.99,
    genre: 'trap',
    bpm: 140,
    key: 'G minor',
    tags: ['trap', '808', 'hard', 'banger'],
    isNFT: true,
    tokenId: 1,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    title: 'Deep House Vibes',
    description: 'Smooth deep house with atmospheric pads and groovy bassline',
    producerId: 'producer-2',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImageUrl: 'https://via.placeholder.com/400x400/4facfe/ffffff?text=Deep+House',
    price: 199.99,
    genre: 'house',
    bpm: 124,
    key: 'A minor',
    tags: ['house', 'deep', 'atmospheric', 'groove'],
    isNFT: false,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    title: 'Gqom Energy',
    description: 'High-energy gqom beat with heavy kicks and minimal synths',
    producerId: 'producer-1',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImageUrl: 'https://via.placeholder.com/400x400/ff6b6b/ffffff?text=Gqom+Energy',
    price: 329.99,
    genre: 'gqom',
    bpm: 130,
    key: 'E minor',
    tags: ['gqom', 'energy', 'minimal', 'south african'],
    isNFT: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
]

const SEED_TRANSACTIONS = [
  {
    beatId: 'beat-1',
    buyerId: 'user-1',
    producerId: 'producer-1',
    amount: 299.99,
    licenseType: 'premium',
    paymentMethod: 'fiat',
    transactionHash: 'fiat_1704067200_abc123',
    status: 'completed',
    createdAt: new Date('2024-01-01'),
    fees: 10.50
  },
  {
    beatId: 'beat-2',
    buyerId: 'user-1',
    producerId: 'producer-2',
    amount: 249.99,
    licenseType: 'basic',
    paymentMethod: 'crypto',
    transactionHash: '0x1234567890abcdef',
    status: 'completed',
    createdAt: new Date('2024-01-15'),
    fees: 6.25
  }
]

export async function seedFirestore() {
  try {
    if (!adminDb) {
      throw new Error('Firebase Admin not initialized')
    }
    
    console.log('🌱 Starting Firestore seeding...')

    // Seed Users
    console.log('👥 Seeding users...')
    for (const [index, userData] of SEED_USERS.entries()) {
      const userId = `user-${index + 1}`
      await adminDb.collection('users').doc(userId).set({
        uid: userId,
        ...userData
      })
      console.log(`✅ Created user: ${userData.displayName}`)
    }

    // Seed Beats
    console.log('🎵 Seeding beats...')
    for (const [index, beatData] of SEED_BEATS.entries()) {
      const beatId = `beat-${index + 1}`
      await adminDb.collection('beats').doc(beatId).set({
        id: beatId,
        ...beatData
      })
      console.log(`✅ Created beat: ${beatData.title}`)
    }

    // Seed Transactions
    console.log('💰 Seeding transactions...')
    for (const [index, transactionData] of SEED_TRANSACTIONS.entries()) {
      const transactionId = `transaction-${index + 1}`
      await adminDb.collection('transactions').doc(transactionId).set({
        id: transactionId,
        ...transactionData
      })
      console.log(`✅ Created transaction: ${transactionId}`)
    }

    // Seed Producer Stats
    console.log('📊 Seeding producer stats...')
    await adminDb.collection('producer-stats').doc('producer-1').set({
      totalEarnings: 2450.75,
      totalSales: 12,
      totalPlays: 1847,
      updatedAt: new Date()
    })
    
    await adminDb.collection('producer-stats').doc('producer-2').set({
      totalEarnings: 1890.50,
      totalSales: 8,
      totalPlays: 1203,
      updatedAt: new Date()
    })

    console.log('🎉 Firestore seeding completed successfully!')
    return { success: true, message: 'Database seeded successfully' }

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    return { success: false, error: error.message }
  }
}