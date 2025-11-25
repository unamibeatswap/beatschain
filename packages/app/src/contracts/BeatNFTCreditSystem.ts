// SPDX-License-Identifier: MIT
export const BeatNFTCreditSystemAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'initialOwner', type: 'address' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'mintCredits',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'burnCredits',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'purchaseCredits',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'upgradeToProNFT',
    inputs: [],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'hasProNFT',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'event',
    name: 'CreditsPurchased',
    inputs: [
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'cost', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'ProNFTUpgrade',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'cost', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'CreditsUsed',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'purpose', type: 'string', indexed: false }
    ]
  }
] as const

export const BeatNFTCreditSystemAddress = {
  1: '0x0000000000000000000000000000000000000000',
  11155111: '0x0000000000000000000000000000000000000000',
  31337: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
} as const

export const BeatNFTCreditSystemConfig = {
  address: BeatNFTCreditSystemAddress,
  abi: BeatNFTCreditSystemAbi
} as const