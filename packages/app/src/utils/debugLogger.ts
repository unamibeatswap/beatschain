'use client'

export const debugLogger = {
  logEnvVars: () => {
    console.log('🔍 Environment Variables Check:')
    console.log('NEXT_PUBLIC_PINATA_JWT:', process.env.NEXT_PUBLIC_PINATA_JWT ? 'SET' : 'MISSING')
    console.log('NEXT_PUBLIC_IPFS_GATEWAY:', process.env.NEXT_PUBLIC_IPFS_GATEWAY ? 'SET' : 'MISSING')
    console.log('NODE_ENV:', process.env.NODE_ENV)
  },
  
  logIPFSConfig: () => {
    const hasJWT = !!process.env.NEXT_PUBLIC_PINATA_JWT
    const hasGateway = !!process.env.NEXT_PUBLIC_IPFS_GATEWAY
    const isConfigured = hasJWT && hasGateway
    
    console.log('📡 IPFS Configuration:')
    console.log('JWT Token:', hasJWT ? '✅ Available' : '❌ Missing')
    console.log('Gateway URL:', hasGateway ? '✅ Available' : '❌ Missing')
    console.log('IPFS Ready:', isConfigured ? '✅ YES' : '❌ NO')
    
    return isConfigured
  }
}