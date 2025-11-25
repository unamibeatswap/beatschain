// SPDX-License-Identifier: MIT
export const BeatNFTAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'initialOwner', type: 'address' },
      { name: '_platformFeeRecipient', type: 'address' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'mintBeat',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'uri', type: 'string' },
      { name: 'price', type: 'uint256' },
      { name: 'royaltyPercentage', type: 'uint256' },
      { name: 'genre', type: 'string' },
      { name: 'bpm', type: 'uint256' },
      { name: 'musicalKey', type: 'string' }
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'buyBeat',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'setBeatForSale',
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'price', type: 'uint256' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'beats',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'price', type: 'uint256' },
      { name: 'producer', type: 'address' },
      { name: 'royaltyPercentage', type: 'uint256' },
      { name: 'isForSale', type: 'bool' },
      { name: 'genre', type: 'string' },
      { name: 'bpm', type: 'uint256' },
      { name: 'musicalKey', type: 'string' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'royaltyInfo',
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'salePrice', type: 'uint256' }
    ],
    outputs: [
      { name: 'receiver', type: 'address' },
      { name: 'royaltyAmount', type: 'uint256' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'event',
    name: 'BeatMinted',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'producer', type: 'address', indexed: true },
      { name: 'price', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'BeatSold',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'price', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'RoyaltyPaid',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'recipient', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false }
    ]
  }
] as const

export const BeatNFTAddress = {
  1: '0x0000000000000000000000000000000000000000', // Mainnet - not deployed
  11155111: '0xff1279331af8bd6321e9c1e00574ce8f1b5d023d', // Sepolia - deployed with 15% fee
  31337: '0x5FbDB2315678afecb367f032d93F642f64180aa3' // Local hardhat
} as const

export const BeatNFTConfig = {
  address: BeatNFTAddress,
  abi: BeatNFTAbi
} as const