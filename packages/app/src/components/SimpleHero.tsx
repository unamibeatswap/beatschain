'use client'

export default function SimpleHero() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '800px' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          fontWeight: 'bold',
          marginBottom: '1rem',
          lineHeight: '1.2'
        }}>
          BeatsChain
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
          marginBottom: '2rem',
          opacity: '0.9'
        }}>
          Where SA Beats Meet Global Blockchain 🇿🇦⚡🌍<br/>
          Blockchain-powered beat marketplace
        </p>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <a 
            href="/marketplace"
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: '600',
              border: '2px solid rgba(255,255,255,0.3)',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
            }}
          >
            Buy Beats (Crypto)
          </a>
          <a 
            href="/upload"
            style={{
              background: 'white',
              color: '#667eea',
              padding: '1rem 2rem',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: '600',
              border: '2px solid white',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8f9fa'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white'
            }}
          >
            Sell Your Beats
          </a>
        </div>
      </div>
    </div>
  )
}