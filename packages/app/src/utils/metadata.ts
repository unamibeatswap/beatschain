export interface BeatMetadata {
  name: string
  description: string
  image: string
  audio: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  external_url?: string
  animation_url?: string
}

export function createBeatMetadata(beat: {
  title: string
  description: string
  genre: string
  bpm: number
  key: string
  producerId: string
  audioUrl: string
  coverImageUrl?: string
}): BeatMetadata {
  return {
    name: beat.title,
    description: beat.description,
    image: beat.coverImageUrl || '',
    audio: beat.audioUrl,
    attributes: [
      { trait_type: 'Genre', value: beat.genre },
      { trait_type: 'BPM', value: beat.bpm },
      { trait_type: 'Key', value: beat.key },
      { trait_type: 'Producer', value: beat.producerId },
      { trait_type: 'Type', value: 'Beat' }
    ],
    external_url: `${process.env.NEXT_PUBLIC_APP_URL}/beat/${beat.title.toLowerCase().replace(/\s+/g, '-')}`
  }
}