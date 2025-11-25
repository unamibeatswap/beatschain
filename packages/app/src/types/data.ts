/**
 * Core data interfaces for BeatsChain
 * Provides consistent data structure regardless of source (Web3 or Sanity)
 */

export interface Beat {
  id: string;
  beatNftId?: string;
  title: string;
  description?: string;
  producerId: string;
  producerName: string;
  genre: string;
  bpm: number;
  key: string;
  price: number;
  audioUrl: string;
  sanityAudioUrl?: string;
  coverImageUrl?: string;
  tags?: string[];
  isNFT: boolean;
  tokenId?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Producer {
  id: string;
  name: string;
  bio?: string;
  location?: string;
  genres: string[];
  totalBeats: number;
  totalSales: number;
  verified: boolean;
  profileImageUrl?: string;
  coverImageUrl?: string;
  walletAddress?: string;
}

export interface DataAdapter {
  getProducer(id: string): Promise<Producer | null>;
  getProducerBeats(producerId: string): Promise<Beat[]>;
  getAllProducers(): Promise<Producer[]>;
  getBeat(id: string): Promise<Beat | null>;
  getFeaturedBeats(limit?: number): Promise<Beat[]>;
}