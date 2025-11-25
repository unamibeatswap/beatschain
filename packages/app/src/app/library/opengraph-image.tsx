import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'BeatsChain Beat Library'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '120px', marginBottom: '20px' }}>🎧</div>
          <h1 style={{ fontSize: '64px', fontWeight: 'bold', margin: '0 0 20px 0' }}>
            My Beat Library
          </h1>
          <p style={{ fontSize: '28px', margin: '0', opacity: 0.9 }}>
            Access Your Purchased Beats & Licenses
          </p>
          <p style={{ fontSize: '24px', margin: '20px 0 0 0', opacity: 0.8 }}>
            🎵 Owned Beats • 📄 Licenses • 💾 Downloads
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}