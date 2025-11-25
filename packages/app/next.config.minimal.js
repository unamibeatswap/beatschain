/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    workerThreads: false,
    cpus: 1
  },
  serverExternalPackages: [
    'pino-pretty', 
    'lokijs', 
    'encoding',
    '@reown/appkit',
    '@reown/appkit-adapter-wagmi',
    'wagmi',
    'viem'
  ],
  webpack: (config, { isServer }) => {
    // Completely exclude problematic packages from server bundle
    if (isServer) {
      config.externals = [
        ...config.externals,
        '@reown/appkit',
        '@reown/appkit-adapter-wagmi',
        'wagmi',
        'viem'
      ]
    }
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    }
    
    return config
  },
}

module.exports = nextConfig