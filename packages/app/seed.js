const { adminDb } = require('./src/lib/firebase-admin.ts');

const SEED_USERS = [
  {
    uid: 'user-1',
    email: 'beatmaster@beatschain.app',
    displayName: 'Beat Master',
    role: 'producer',
    isVerified: true,
    createdAt: new Date('2024-01-01')
  },
  {
    uid: 'user-2',
    email: 'djpro@beatschain.app',
    displayName: 'DJ Pro',
    role: 'producer',
    isVerified: true,
    createdAt: new Date('2024-01-05')
  },
  {
    uid: 'user-3',
    email: 'musiclover@beatschain.app',
    displayName: 'Music Lover',
    role: 'user',
    isVerified: false,
    createdAt: new Date('2024-01-10')
  }
];

const SEED_BEATS = [
  {
    id: 'beat-1',
    title: 'Amapiano Fire',
    description: 'Hot amapiano beat with deep basslines',
    producerId: 'user-1',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImageUrl: 'https://via.placeholder.com/400x400/667eea/ffffff?text=Amapiano',
    price: 299.99,
    genre: 'amapiano',
    bpm: 112,
    key: 'C minor',
    tags: ['amapiano', 'piano', 'bass'],
    isNFT: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'beat-2',
    title: 'Afrobeats Groove',
    description: 'Infectious afrobeats rhythm',
    producerId: 'user-2',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImageUrl: 'https://via.placeholder.com/400x400/764ba2/ffffff?text=Afrobeats',
    price: 249.99,
    genre: 'afrobeats',
    bpm: 102,
    key: 'F major',
    tags: ['afrobeats', 'percussion'],
    isNFT: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'beat-3',
    title: 'Trap Banger',
    description: 'Hard-hitting trap beat',
    producerId: 'user-1',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    coverImageUrl: 'https://via.placeholder.com/400x400/f093fb/ffffff?text=Trap',
    price: 399.99,
    genre: 'trap',
    bpm: 140,
    key: 'G minor',
    tags: ['trap', '808'],
    isNFT: true,
    tokenId: 1,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
];

async function seedData() {
  try {
    console.log('🌱 Seeding users...');
    for (const user of SEED_USERS) {
      await adminDb.collection('users').doc(user.uid).set(user);
      console.log(`✅ ${user.displayName}`);
    }

    console.log('🎵 Seeding beats...');
    for (const beat of SEED_BEATS) {
      await adminDb.collection('beats').doc(beat.id).set(beat);
      console.log(`✅ ${beat.title}`);
    }

    console.log('📊 Seeding producer stats...');
    await adminDb.collection('producer-stats').doc('user-1').set({
      totalEarnings: 2450.75,
      totalSales: 12,
      totalPlays: 1847,
      updatedAt: new Date()
    });

    await adminDb.collection('producer-stats').doc('user-2').set({
      totalEarnings: 1890.50,
      totalSales: 8,
      totalPlays: 1203,
      updatedAt: new Date()
    });

    console.log('🎉 Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedData();