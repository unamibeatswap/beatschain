const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: "beatswap-36c32",
  private_key_id: "5e37d6d10111d7401b68837a27ef6a067155724a",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC8jPizYYXqWLsI\nL0W3o+ywMbF4C01zPgMsU195gM8lkjv77Fd0k09j360jrztauX2VvNyx0XE+8o68\n61VEo9+LEWgUWvNpRv6PkeV/3cBmPdJGv2SW5nGO8r4c9ZP3/0zlbyZEjdabm3rd\nDR9xpU6mMVvUvVVt/DqG6JFlGB0r7PfXNww2Wl66CNIySgEuQyx1gTqnxM4OaL3w\nAGSvCUL0R74ediWVuA+94PWILOyBsIUAk3OqzLO6kNu8/9MiUabDSpJ0Xx6arhuG\nX9qiPLdjR23DWV02Ojax16gnzAweDosdoFPzWthMwhM5QhN/Qw7O7YXDlZEW5GOE\nm63kWI2zAgMBAAECggEAJNcSfNIQPVKq8JVz9Malp2N+PmtO7bZvHkkH/ZCKaNfi\nun1aNR/XQjdg9/j0Cuz1Ob2WDXRTwS3Zb9Y3adrvAZgcEuYWazqA4IJsKgik4BUy\nMbqRp95Mz9ZkCPp+t9T9LFMEUh64kNzXK7u1qhnXfSdlvvJjb8L5mIR2bB9DC+LC\nQiEiMUasxAVcgfe/KAQgh5FgEuYz6+ytrFoav3ykIrH5E6ywsUdo9Fp+4c4qRSKa\nXP1Nf6AsSkSSh8ZFP82fMdcv5zx5yzd+jqnMyd9rDPIt9ttxJToqyxxfvJp8bvAg\n9wPz9aa1oTUJMa/k2eyWPPZ28tyYG/kZVRRAFraTsQKBgQDiJyC8+nQ/dIBbnCCI\nqsv/Npp5FcD15G+jZi7AOaMyZwdEuBmjuextxEofsrfxop8M2nIoDHzLPy7xsbP/\n0ft8kT74rXY3CgYAmLcpI/7P8FDLS35uEtBNJu/vshQMdIUagQBRvXZqjrgw0sic\n5rG0+jBU9ppTBrK37FAOpg7qwKBgQDVb2eSQnWBXAByHynUAKaltGraCQsBU0jw\nxijoBTb4eXUZJP3WPwjdN2+gOo53776IIX+g92yExaf9q2XLebP33auu65Z/AxYR\nFsu16v7FMfbWG3aSwtNALuXTB6hDm3N9izvErrYzfJxhDm1WnCKM17fmLT8GRh16\nNmhBgEYuGQKBgBI73WPfPagwGHlKaUUboD7/hAznOBubQ3UFNBfDjejubaOYxFhz\nESD4hpFvs20EE5bRtgqMlzM78OkDzuN9Zq1weIdMVQ+y+zDpHztt74mMcrcxawws\n8CaIUSgeT4eBjYnJhOESSY3l2+vz0sDuDWiihU2xGRcMT8yzpHLtRoDpAoGAFn2o\n0lbCfyEswtnZ1IdFCE0cvWEakccu9oBLKzfxdPmHh2DIht0ZmAYRczb4cFcJIts0\n0ceA3fTeIPMAxRJMDqCDSOl2cGfo2WAnk0HyGuGK+0Dlm81/6VGH0lcKOiWVY/Na\nFv26IW7OI8QbbXcChQjuTgkSjRyyWoCFN/HGc3ECgYAdW5265zgnEn30tVxVlWR3\nPsc/bd+rq5i558LizKDHbCuzxvFyXC1JZQqm9FXeaRQVAeD8qpeweD35h6q1F+nn\nZeSPAj7VqeuVH4QMkvEB6l6dNWN6V7esU0KirNTUeapofNgKvQoj1qz2I++fEqVY\nEiANKYf0rGU3jH1OzeZLyg==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@beatswap-36c32.iam.gserviceaccount.com",
  client_id: "109633865516363435614",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedData() {
  try {
    console.log('🌱 Starting seed...');

    // Users
    await db.collection('users').doc('user-1').set({
      uid: 'user-1',
      email: 'beatmaster@beatschain.app',
      displayName: 'Beat Master',
      role: 'producer',
      isVerified: true,
      createdAt: new Date()
    });

    await db.collection('users').doc('user-2').set({
      uid: 'user-2',
      email: 'djpro@beatschain.app',
      displayName: 'DJ Pro',
      role: 'producer',
      isVerified: true,
      createdAt: new Date()
    });

    // Beats
    await db.collection('beats').doc('beat-1').set({
      id: 'beat-1',
      title: 'Amapiano Fire',
      description: 'Hot amapiano beat',
      producerId: 'user-1',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      coverImageUrl: 'https://via.placeholder.com/400x400/667eea/ffffff?text=Amapiano',
      price: 299.99,
      genre: 'amapiano',
      bpm: 112,
      key: 'C minor',
      tags: ['amapiano', 'piano'],
      isNFT: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await db.collection('beats').doc('beat-2').set({
      id: 'beat-2',
      title: 'Trap Banger',
      description: 'Hard trap beat',
      producerId: 'user-1',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      coverImageUrl: 'https://via.placeholder.com/400x400/f093fb/ffffff?text=Trap',
      price: 399.99,
      genre: 'trap',
      bpm: 140,
      key: 'G minor',
      tags: ['trap', '808'],
      isNFT: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Producer Stats
    await db.collection('producer-stats').doc('user-1').set({
      totalEarnings: 2450.75,
      totalSales: 12,
      totalPlays: 1847,
      updatedAt: new Date()
    });

    console.log('✅ Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedData();