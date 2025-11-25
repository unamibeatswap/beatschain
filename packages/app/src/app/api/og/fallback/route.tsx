import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontSize: 60,
          fontWeight: 800,
          color: 'white',
          padding: '0 120px',
          textAlign: 'center',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 30,
            left: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 900,
              background: 'white',
              color: '#764ba2',
              padding: '8px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>🎵</span>
            <span>BeatsChain</span>
          </div>
        </div>
        
        <div style={{ maxWidth: '900px' }}>
          BeatsChain
        </div>
        
        <div
          style={{
            fontSize: 30,
            fontWeight: 400,
            opacity: 0.9,
            marginTop: 20,
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          Web3 Beat Marketplace
        </div>
        
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              fontSize: 24,
              opacity: 0.8,
            }}
          >
            beatschain.app
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // Add cache control headers for longer caching
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        'Content-Type': 'image/png'
      }
    }
  )
}