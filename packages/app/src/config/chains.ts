import { mainnet, sepolia, polygon, bsc, arbitrum } from 'viem/chains'

export interface ChainConfig {
  id: number
  name: string
  symbol: string
  rpcUrl: string
  blockExplorer: string
  contractAddress?: string
  isTestnet: boolean
  gasPrice?: string
}

export const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    id: mainnet.id,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
    blockExplorer: 'https://etherscan.io',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    isTestnet: false,
    gasPrice: 'high'
  },
  {
    id: sepolia.id,
    name: 'Sepolia Testnet',
    symbol: 'ETH',
    rpcUrl: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
    blockExplorer: 'https://sepolia.etherscan.io',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    isTestnet: true,
    gasPrice: 'low'
  },
  {
    id: polygon.id,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    isTestnet: false,
    gasPrice: 'low'
  },
  {
    id: bsc.id,
    name: 'BNB Chain',
    symbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
    isTestnet: false,
    gasPrice: 'low'
  },
  {
    id: arbitrum.id,
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    isTestnet: false,
    gasPrice: 'low'
  }
]

export const getChainById = (chainId: number): ChainConfig | undefined => {
  return SUPPORTED_CHAINS.find(chain => chain.id === chainId)
}

export const getChainIcon = (chainId: number): string => {
  switch (chainId) {
    case mainnet.id:
    case sepolia.id:
      return '⟠'
    case polygon.id:
      return '🔷'
    case bsc.id:
      return '🟡'
    case arbitrum.id:
      return '🔵'
    default:
      return '⛓️'
  }
}