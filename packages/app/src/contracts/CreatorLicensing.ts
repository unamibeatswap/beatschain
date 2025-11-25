export const CreatorLicensingAddress = '0x0ae18b951a38ef7464e77ec9b309c3505c4eb4a0';

export const CreatorLicensingABI = [
  {
    "inputs": [{"internalType": "address", "name": "initialOwner", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "BASIS_POINTS",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PLATFORM_FEE",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_negotiationId", "type": "uint256"}
    ],
    "name": "acceptNegotiation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_beatNftId", "type": "uint256"},
      {"internalType": "address", "name": "_producer", "type": "address"},
      {"internalType": "uint256", "name": "_proposedPrice", "type": "uint256"},
      {"internalType": "uint256", "name": "_creatorRoyaltyShare", "type": "uint256"},
      {"internalType": "string", "name": "_message", "type": "string"}
    ],
    "name": "createNegotiation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_creator", "type": "address"}
    ],
    "name": "getCreatorNegotiations",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_producer", "type": "address"}
    ],
    "name": "getProducerNegotiations",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "name": "negotiations",
    "outputs": [
      {"internalType": "uint256", "name": "beatNftId", "type": "uint256"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "address", "name": "producer", "type": "address"},
      {"internalType": "uint256", "name": "proposedPrice", "type": "uint256"},
      {"internalType": "uint256", "name": "creatorRoyaltyShare", "type": "uint256"},
      {"internalType": "string", "name": "message", "type": "string"},
      {"internalType": "bool", "name": "isAccepted", "type": "bool"},
      {"internalType": "bool", "name": "isPaid", "type": "bool"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_negotiationId", "type": "uint256"}
    ],
    "name": "payLicense",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "negotiationId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "LicensePaid",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "negotiationId", "type": "uint256"}
    ],
    "name": "NegotiationAccepted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "negotiationId", "type": "uint256"},
      {"indexed": true, "internalType": "uint256", "name": "beatNftId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"},
      {"indexed": false, "internalType": "address", "name": "producer", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "proposedPrice", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "creatorRoyaltyShare", "type": "uint256"}
    ],
    "name": "NegotiationCreated",
    "type": "event"
  }
] as const;