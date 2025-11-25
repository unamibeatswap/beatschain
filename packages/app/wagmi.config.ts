import { defineConfig } from '@wagmi/cli'
import { actions, hardhat } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'src/abis.ts',
  contracts: [
    {
      name: 'BeatNFT',
      address: {
        31337: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Local Hardhat
        11155111: '0x0000000000000000000000000000000000000000', // Sepolia - to be deployed
      },
    },
  ],
  plugins: [
    actions(),
    hardhat({
      project: '../hardhat',
      deployments: {
        BeatNFT: {
          31337: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        },
      },
    }),

  ],
})
