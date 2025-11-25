import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // Real-time beat discovery from live application
    const discoveredBeats: any[] = []
    
    // Discover from community beats API
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://beatschain.app'
      const response = await fetch(`${baseUrl}/api/community-beats`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.beats) {
          discoveredBeats.push(...data.beats)
        }
      }
    } catch (error) {
      console.warn('Error discovering community beats:', error)
    }
    
    // Filter and sort active beats
    const activeBeats = discoveredBeats
      .filter(beat => beat.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
    
    return NextResponse.json({
      success: true,
      beats: activeBeats,
      count: activeBeats.length,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Beat discovery API error:', error)
    return NextResponse.json({
      success: false,
      beats: [],
      count: 0,
      error: 'Failed to discover beats'
    }, { status: 500 })
  }
}