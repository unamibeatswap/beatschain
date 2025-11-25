const hre = require('hardhat')
const { viem } = hre

async function main() {
  console.log('🔄 Interacting with BeatNFT Credit System...')
  
  const publicClient = await viem.getPublicClient()
  const [deployer, user1, user2] = await viem.getWalletClients()
  
  // Contract address from deployment
  const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
  
  console.log('Contract address:', contractAddress)
  console.log('Deployer address:', deployer.account.address)
  console.log('User1 address:', user1.account.address)
  
  // Get ABI from artifact
  const abi = (await hre.artifacts.readArtifact('BeatNFTCreditSystem')).abi
  
  // Check initial credit balance
  const initialCredits = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'getCreditBalance',
    args: [deployer.account.address]
  })
  
  console.log('Initial credits for deployer:', initialCredits.toString())
  
  // Grant free credits to user1
  console.log('\n🎁 Granting free credits to user1...')
  const grantTx = await deployer.writeContract({
    address: contractAddress,
    abi,
    functionName: 'grantFreeCredits',
    args: [user1.account.address, 20n]
  })
  
  console.log('Grant transaction:', grantTx)
  
  // Check user1 credits
  const user1Credits = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'getCreditBalance',
    args: [user1.account.address]
  })
  
  console.log('User1 credits after grant:', user1Credits.toString())
  
  // User1 purchases credits
  console.log('\n💰 User1 purchasing credits...')
  const purchaseTx = await user1.writeContract({
    address: contractAddress,
    abi,
    functionName: 'purchaseCredits',
    args: [0n], // Package ID 0 (10 credits for 0.01 ETH)
    value: 10000000000000000n // 0.01 ETH
  })
  
  console.log('Purchase transaction:', purchaseTx)
  
  // Check user1 credits after purchase
  const user1CreditsAfterPurchase = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'getCreditBalance',
    args: [user1.account.address]
  })
  
  console.log('User1 credits after purchase:', user1CreditsAfterPurchase.toString())
  
  // User2 upgrades to Pro NFT
  console.log('\n⭐ User2 upgrading to Pro NFT...')
  const upgradeTx = await user2.writeContract({
    address: contractAddress,
    abi,
    functionName: 'upgradeToProNFT',
    args: [],
    value: 100000000000000000n // 0.1 ETH
  })
  
  console.log('Upgrade transaction:', upgradeTx)
  
  // Check if user2 has Pro NFT
  const user2HasPro = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'hasProNFT',
    args: [user2.account.address]
  })
  
  console.log('User2 has Pro NFT:', user2HasPro)
  
  // Check user2 credits (should be unlimited)
  const user2Credits = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'getCreditBalance',
    args: [user2.account.address]
  })
  
  console.log('User2 credits (Pro NFT):', user2Credits.toString())
  
  console.log('\n✅ Interaction completed successfully!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Interaction failed:', error)
    process.exit(1)
  })