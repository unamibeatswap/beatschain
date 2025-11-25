import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const beatData = await request.json()
    
    console.log(`📥 API POST /beat-metadata/${params.id}:`, {
      title: beatData.title,
      coverImageUrl: beatData.coverImageUrl,
      dataKeys: Object.keys(beatData)
    })
    
    // Store the real beat data temporarily for social scrapers
    const key = `beat_${params.id}`
    
    // In production, use Redis or similar. For now, use a simple in-memory store
    global.beatMetadataCache = global.beatMetadataCache || new Map()
    
    console.log(`🔧 Cache before set:`, {
      cacheSize: global.beatMetadataCache.size,
      hasKey: global.beatMetadataCache.has(key),
      allKeys: Array.from(global.beatMetadataCache.keys())
    })
    global.beatMetadataCache.set(key, {
      ...beatData,
      timestamp: Date.now()
    })
    
    console.log(`✅ Cached beat ${params.id}. Cache now has ${global.beatMetadataCache.size} entries`)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`❌ Failed to cache beat ${params.id}:`, error)
    return NextResponse.json({ error: 'Failed to cache beat data' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const key = `beat_${params.id}`
  const cached = global.beatMetadataCache?.get(key)
  
  console.log(`🔍 API GET /beat-metadata/${params.id}:`, {
    cacheExists: !!cached,
    cacheKeys: global.beatMetadataCache ? Array.from(global.beatMetadataCache.keys()) : [],
    requestedKey: key
  })
  
  if (!cached) {
    console.log(`❌ Beat ${params.id} not found in cache`)
    return NextResponse.json({ error: 'Beat data not found' }, { status: 404 })
  }
  
  // Ensure coverImageUrl is included with multiple field fallbacks
  const beatData = {
    ...cached,
    coverImageUrl: cached.coverImageUrl || cached.coverImage || cached.image || cached.artwork || ''
  }
  
  console.log(`✅ Returning beat data for ${params.id}:`, { 
    title: beatData.title, 
    coverImageUrl: beatData.coverImageUrl 
  })
  
  return NextResponse.json(beatData)
}