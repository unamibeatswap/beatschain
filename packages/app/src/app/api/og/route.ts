import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'BeatsChain'
    const description = searchParams.get('description') || 'Web3 Beat Marketplace'
    const beatImage = searchParams.get('image')
    const producer = searchParams.get('producer')
    const price = searchParams.get('price')
    const genre = searchParams.get('genre')

    // Simple SVG-based OG image generation
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="1200" height="630" fill="url(#bg)"/>
        
        <!-- Overlay -->
        <rect width="1200" height="630" fill="rgba(0,0,0,0.3)"/>
        
        <!-- Logo/Brand -->
        <text x="60" y="80" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white">
          🎫 BeatsChain
        </text>
        
        <!-- Title -->
        <text x="60" y="200" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="start">
          ${title.length > 30 ? title.substring(0, 30) + '...' : title}
        </text>
        
        <!-- Description -->
        <text x="60" y="260" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.9)" text-anchor="start">
          ${description.length > 50 ? description.substring(0, 50) + '...' : description}
        </text>
        
        <!-- Beat Details -->
        ${producer ? `<text x="60" y="320" font-family="Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.8)">Producer: ${producer}</text>` : ''}
        ${genre ? `<text x="60" y="360" font-family="Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.8)">Genre: ${genre}</text>` : ''}
        ${price ? `<text x="60" y="400" font-family="Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.8)">Price: ${price} ETH</text>` : ''}
        
        <!-- Footer -->
        <text x="60" y="550" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.7)">
          Web3 Beat Marketplace • Blockchain-Powered Music
        </text>
        
        <!-- Decorative Elements -->
        <circle cx="1000" cy="150" r="80" fill="rgba(255,255,255,0.1)"/>
        <circle cx="1100" cy="250" r="60" fill="rgba(255,255,255,0.05)"/>
        <circle cx="950" cy="300" r="40" fill="rgba(255,255,255,0.08)"/>
      </svg>
    `

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('OG image generation failed:', error)
    return new NextResponse('Error generating image', { status: 500 })
  }
}