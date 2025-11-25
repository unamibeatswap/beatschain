// Mock Data Generator for Asset Hub Testing
class MockDataGenerator {
  static async generateMockData() {
    const mockNFTs = [
      {
        id: 'nft_001',
        type: 'nft',
        title: 'Midnight Vibes',
        artist: 'DJ Shadow',
        genre: 'Hip-Hop',
        isrc: 'ZA-80G-25-00001',
        duration: '3:45',
        format: 'MP3',
        audioUrl: 'blob:mock-audio-1',
        coverUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNEVEQ0M0Ii8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+OtTwvdGV4dD4KPHN2Zz4K',
        blockchain: {
          contract: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A',
          tokenId: '1001',
          transactionHash: '0x123abc...',
          network: 'Polygon Mumbai'
        },
        createdAt: '2025-01-15T10:30:00Z',
        plays: 127,
        likes: 23,
        isMockData: true
      },
      {
        id: 'nft_002',
        type: 'nft',
        title: 'Electric Dreams',
        artist: 'Synth Master',
        genre: 'Electronic',
        isrc: 'ZA-80G-25-00002',
        duration: '4:12',
        format: 'WAV',
        audioUrl: 'blob:mock-audio-2',
        coverUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRkY2QjZCIi8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+OtTwvdGV4dD4KPHN2Zz4K',
        blockchain: {
          contract: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A',
          tokenId: '1002',
          transactionHash: '0x456def...',
          network: 'Polygon Mumbai'
        },
        createdAt: '2025-01-14T15:20:00Z',
        plays: 89,
        likes: 15,
        isMockData: true
      },
      {
        id: 'nft_003',
        type: 'nft',
        title: 'Afro Fusion',
        artist: 'Kwaito King',
        genre: 'Kwaito',
        isrc: 'ZA-80G-25-00003',
        duration: '3:28',
        format: 'MP3',
        audioUrl: 'blob:mock-audio-3',
        coverUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjOUMyN0IwIi8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+OtTwvdGV4dD4KPHN2Zz4K',
        blockchain: {
          contract: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A',
          tokenId: '1003',
          transactionHash: '0x789ghi...',
          network: 'Polygon Mumbai'
        },
        createdAt: '2025-01-13T09:15:00Z',
        plays: 203,
        likes: 41,
        isMockData: true
      },
      {
        id: 'nft_004',
        type: 'nft',
        title: 'Gospel Harmony',
        artist: 'Praise Voices',
        genre: 'Gospel',
        isrc: 'ZA-80G-25-00004',
        duration: '5:03',
        format: 'FLAC',
        audioUrl: 'blob:mock-audio-4',
        coverUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRkY5ODAwIi8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+OtTwvdGV4dD4KPHN2Zz4K',
        blockchain: {
          contract: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A',
          tokenId: '1004',
          transactionHash: '0xabcjkl...',
          network: 'Polygon Mumbai'
        },
        createdAt: '2025-01-12T14:45:00Z',
        plays: 156,
        likes: 32,
        isMockData: true
      }
    ];

    const mockCampaigns = [
      {
        id: 'campaign_001',
        type: 'campaign',
        title: 'Summer Music Festival Promo',
        artist: 'Festival Sponsors',
        description: 'Promoting upcoming summer music festival with local artists',
        status: 'active',
        impressions: 15420,
        clicks: 892,
        createdAt: '2025-01-10T08:00:00Z',
        isMockData: true
      },
      {
        id: 'campaign_002',
        type: 'campaign',
        title: 'New Artist Spotlight',
        artist: 'Music Discovery',
        description: 'Highlighting emerging talent in South African music scene',
        status: 'active',
        impressions: 8750,
        clicks: 445,
        createdAt: '2025-01-08T12:30:00Z',
        isMockData: true
      },
      {
        id: 'campaign_003',
        type: 'campaign',
        title: 'Hip-Hop Heritage Month',
        artist: 'Cultural Events',
        description: 'Celebrating hip-hop culture and its impact on South African music',
        status: 'completed',
        impressions: 22100,
        clicks: 1340,
        createdAt: '2025-01-05T16:20:00Z',
        isMockData: true
      }
    ];

    const mockISRCRegistry = [
      {
        id: 'isrc_001',
        isrc: 'ZA-80G-25-00001',
        artist: 'DJ Shadow',
        title: 'Midnight Vibes',
        status: 'active',
        embedded: true,
        createdAt: '2025-01-15T10:25:00Z',
        isMockData: true
      },
      {
        id: 'isrc_002',
        isrc: 'ZA-80G-25-00002',
        artist: 'Synth Master',
        title: 'Electric Dreams',
        status: 'active',
        embedded: true,
        createdAt: '2025-01-14T15:15:00Z',
        isMockData: true
      },
      {
        id: 'isrc_003',
        isrc: 'ZA-80G-25-00003',
        artist: 'Kwaito King',
        title: 'Afro Fusion',
        status: 'active',
        embedded: true,
        createdAt: '2025-01-13T09:10:00Z',
        isMockData: true
      }
    ];

    // Store in Chrome storage with error handling
    try {
      await chrome.storage.local.set({
        nftAssets: mockNFTs,
        campaigns: mockCampaigns,
        isrcRegistry: mockISRCRegistry
      });
      console.log('✅ Mock data generated and stored in Chrome storage');
    } catch (error) {
      console.error('❌ Failed to store mock data in Chrome storage:', error);
      // Fallback to localStorage for development
      localStorage.setItem('nftAssets', JSON.stringify(mockNFTs));
      localStorage.setItem('campaigns', JSON.stringify(mockCampaigns));
      localStorage.setItem('isrcRegistry', JSON.stringify(mockISRCRegistry));
      console.log('✅ Mock data stored in localStorage as fallback');
    }

    return { nftAssets: mockNFTs, campaigns: mockCampaigns, isrcRegistry: mockISRCRegistry };
  }

  static async clearMockData() {
    try {
      await chrome.storage.local.remove(['nftAssets', 'campaigns', 'isrcRegistry']);
      console.log('🗑️ Mock data cleared from Chrome storage');
    } catch (error) {
      console.error('❌ Failed to clear Chrome storage:', error);
      // Fallback to localStorage
      localStorage.removeItem('nftAssets');
      localStorage.removeItem('campaigns');
      localStorage.removeItem('isrcRegistry');
      console.log('🗑️ Mock data cleared from localStorage');
    }
  }
}

// Mock data generator is now manually controlled by the asset hub loader
// No auto-initialization to prevent conflicts

window.MockDataGenerator = MockDataGenerator;