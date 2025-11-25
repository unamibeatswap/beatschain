import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { beatId, beatData } = await request.json()
    
    console.log(`🔄 Manual sync for beat ${beatId}:`, {
      title: beatData.title,
      coverImageUrl: beatData.coverImageUrl,
      dataKeys: Object.keys(beatData)
    })
    
    // Store in the same cache as the metadata API
    const key = `beat_${beatId}`
    global.beatMetadataCache = global.beatMetadataCache || new Map()
    
    global.beatMetadataCache.set(key, {
      ...beatData,
      timestamp: Date.now()
    })
    
    console.log(`✅ Manually synced beat ${beatId}`)
    
    return NextResponse.json({ 
      success: true, 
      message: `Beat ${beatId} synced successfully`,
      cacheSize: global.beatMetadataCache.size
    })
  } catch (error) {
    console.error('❌ Manual sync error:', error)
    return NextResponse.json({ error: 'Failed to sync beat' }, { status: 500 })
  }
}