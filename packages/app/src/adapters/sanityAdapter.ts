/**
 * Sanity CMS data adapter
 * Fetches and normalizes data from Sanity CMS
 */

import { client, urlFor } from '@/lib/sanity-client';
import { Beat, Producer, DataAdapter } from '@/types/data';

export class SanityAdapter implements DataAdapter {
  async getProducer(id: string): Promise<Producer | null> {
    try {
      if (!id) {
        console.warn('Empty producer ID provided');
        return null;
      }
      
      const producer = await client.fetch(`
        *[_type == "producer" && slug.current == $id][0] {
          _id, name, bio, location, genres, profileImage, coverImage, 
          verified, walletAddress, stats
        }
      `, { id });
      
      if (!producer) return null;
      
      return {
        id: producer.slug?.current || producer._id,
        name: producer.name || 'Beat Creator',
        bio: producer.bio || '',
        location: producer.location || 'South Africa',
        genres: Array.isArray(producer.genres) ? producer.genres : ['Hip Hop'],
        totalBeats: producer.stats?.totalBeats || 0,
        totalSales: producer.stats?.totalSales || 0,
        verified: producer.verified || false,
        profileImageUrl: producer.profileImage ? urlFor(producer.profileImage).url() : undefined,
        coverImageUrl: producer.coverImage ? urlFor(producer.coverImage).url() : undefined,
        walletAddress: producer.walletAddress || undefined
      };
    } catch (error) {
      console.error('Error fetching producer from Sanity:', error);
      return null;
    }
  }

  async getProducerBeats(producerId: string): Promise<Beat[]> {
    try {
      if (!producerId) {
        console.warn('Empty producer ID provided');
        return [];
      }
      
      const beats = await client.fetch(`
        *[_type == "beat" && producer->slug.current == $producerId] {
          _id, title, slug, description, producer->{name, slug},
          stageName, genre, bpm, key, price, audioFile, coverImage
        }
      `, { producerId });
      
      // Ensure we have an array even if the query returns null
      if (!beats) return [];
      
      return beats.map((b: any) => ({
        id: b.slug?.current || b._id,
        title: b.title || 'Untitled Beat',
        description: b.description || '',
        producerId: b.producer?.slug?.current || '',
        producerName: b.stageName || b.producer?.name || '',
        genre: b.genre || 'Hip Hop',
        bpm: b.bpm || 120,
        key: b.key || 'C',
        price: b.price || 0.05,
        audioUrl: b.audioFile?.asset?.url || '',
        coverImageUrl: b.coverImage ? urlFor(b.coverImage).url() : undefined,
        isNFT: false
      }));
    } catch (error) {
      console.error('Error fetching beats from Sanity:', error);
      return [];
    }
  }

  async getAllProducers(): Promise<Producer[]> {
    try {
      const producers = await client.fetch(`
        *[_type == "producer"] {
          _id, name, slug, bio, location, genres, profileImage, 
          coverImage, verified, walletAddress, stats
        }
      `);
      
      // Ensure we have an array even if the query returns null
      if (!producers) return [];
      
      return producers.map((p: any) => ({
        id: p.slug?.current || p._id,
        name: p.name || 'Beat Creator',
        bio: p.bio || '',
        location: p.location || 'South Africa',
        genres: p.genres || ['Hip Hop'],
        totalBeats: p.stats?.totalBeats || 0,
        totalSales: p.stats?.totalSales || 0,
        verified: p.verified || false,
        profileImageUrl: p.profileImage ? urlFor(p.profileImage).url() : undefined,
        coverImageUrl: p.coverImage ? urlFor(p.coverImage).url() : undefined,
        walletAddress: p.walletAddress || undefined
      }));
    } catch (error) {
      console.error('Error fetching producers from Sanity:', error);
      return [];
    }
  }

  async getBeat(id: string): Promise<Beat | null> {
    try {
      if (!id) {
        console.warn('Empty beat ID provided');
        return null;
      }
      
      const beat = await client.fetch(`
        *[_type == "beat" && slug.current == $id][0] {
          _id, title, slug, description, producer->{name, slug},
          stageName, genre, bpm, key, price, audioFile, coverImage
        }
      `, { id });
      
      if (!beat) return null;
      
      return {
        id: beat.slug?.current || beat._id,
        title: beat.title || 'Untitled Beat',
        description: beat.description || '',
        producerId: beat.producer?.slug?.current || '',
        producerName: beat.stageName || beat.producer?.name || '',
        genre: beat.genre || 'Hip Hop',
        bpm: beat.bpm || 120,
        key: beat.key || 'C',
        price: beat.price || 0.05,
        audioUrl: beat.audioFile?.asset?.url || '',
        sanityAudioUrl: beat.audioFile?.asset?.url || '',
        coverImageUrl: beat.coverImage ? urlFor(beat.coverImage).url() : undefined,
        isNFT: false
      };
    } catch (error) {
      console.error('Error fetching beat from Sanity:', error);
      return null;
    }
  }

  async getFeaturedBeats(limit: number = 6): Promise<Beat[]> {
    try {
      // First try to get featured beats
      let beats = await client.fetch(`
        *[_type == "beat" && featured == true] {
          _id, title, slug, description, producer->{name, slug},
          stageName, genre, bpm, key, price, audioFile, coverImage
        }
      `);
      
      // If no featured beats, get any beats up to the limit
      if (!beats || beats.length === 0) {
        beats = await client.fetch(`
          *[_type == "beat"] {
            _id, title, slug, description, producer->{name, slug},
            stageName, genre, bpm, key, price, audioFile, coverImage
          }
        `);
      }
      
      // Ensure we have an array even if the query returns null
      if (!beats) beats = [];
      
      return beats.map((b: any) => ({
        id: b.slug?.current || b._id,
        title: b.title || 'Untitled Beat',
        description: b.description || '',
        producerId: b.producer?.slug?.current || '',
        producerName: b.stageName || b.producer?.name || '',
        genre: b.genre || 'Hip Hop',
        bpm: b.bpm || 120,
        key: b.key || 'C',
        price: b.price || 0.05,
        audioUrl: b.audioFile?.asset?.url || '',
        coverImageUrl: b.coverImage ? urlFor(b.coverImage).url() : undefined,
        isNFT: false
      }));
    } catch (error) {
      console.error('Error fetching featured beats from Sanity:', error);
      return [];
    }
  }
}