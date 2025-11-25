/**
 * Minimal Web3 adapter - simplified for build compatibility
 */

import { Beat, Producer, DataAdapter } from '@/types/data';

export class Web3Adapter implements DataAdapter {
  async getProducer(walletAddress: string): Promise<Producer | null> {
    if (!walletAddress?.startsWith('0x')) return null;
    
    return {
      id: walletAddress.toLowerCase(),
      name: 'Web3 Producer',
      bio: 'Producer on BeatsChain platform.',
      location: 'Blockchain',
      genres: ['Hip Hop'],
      totalBeats: 0,
      totalSales: 0,
      verified: false,
      walletAddress
    };
  }

  async getProducerBeats(walletAddress: string): Promise<Beat[]> {
    return [];
  }

  async getAllProducers(): Promise<Producer[]> {
    return [];
  }

  async getBeat(tokenId: string): Promise<Beat | null> {
    return null;
  }

  async getFeaturedBeats(limit: number = 6): Promise<Beat[]> {
    return [];
  }
}