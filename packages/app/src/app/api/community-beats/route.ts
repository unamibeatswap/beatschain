import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const communityBeats: any[] = []
    
    // Get beats from global metadata cache (real cached beats)
    try {
      // Initialize global cache if it doesn't exist
      if (typeof global !== 'undefined') {
        global.beatMetadataCache = global.beatMetadataCache || new Map()
        
        if (global.beatMetadataCache.size > 0) {
          const cachedEntries = Array.from(global.beatMetadataCache.entries())
          
          cachedEntries.forEach(([key, beat]) => {
            if (beat && beat.id && beat.title) {
              communityBeats.push({
                ...beat,
                source: 'community',
                discoveredAt: new Date().toISOString(),
                isActive: beat.isActive !== false
              })
            }
          })
          
          console.log(`Community API: Found ${cachedEntries.length} cached beats, ${communityBeats.length} valid`)
        } else {
          console.log('Community API: Global cache is empty')
        }
      }
      
    } catch (error) {
      console.warn('Error fetching community beats:', error)
    }
    
    // Filter and sort active beats
    const uniqueBeats = communityBeats
      .filter((beat, index, self) => 
        beat.isActive && self.findIndex(b => b.id === beat.id) === index
      )
      .sort((a, b) => new Date(b.createdAt || b.timestamp || 0).getTime() - new Date(a.createdAt || a.timestamp || 0).getTime())
      .slice(0, 20)
    
    return NextResponse.json({
      success: true,
      beats: uniqueBeats,
      count: uniqueBeats.length,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Community beats API error:', error)
    return NextResponse.json({
      success: false,
      beats: [],
      count: 0,
      error: 'Failed to fetch community beats'
    }, { status: 500 })
  }
}