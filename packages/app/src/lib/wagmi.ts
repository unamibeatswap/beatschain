import { createConfig, http } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'

export const config = createConfig({
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
})