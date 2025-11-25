const hre = require('hardhat')
const { viem } = hre

async function main() {
  console.log('🚀 Deploying BeatNFT Credit System to Sepolia...')
  
  const publicClient = await viem.getPublicClient()
  const [deployer] = await viem.getWalletClients()
  
  // Security check for default hardhat account
  if (deployer.account.address.toLowerCase() === '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266') {
    console.error('❌ ABORTING: Refusing to deploy with default account to Sepolia!')
    console.error('   Please use a secure, private key for deployment to public networks.')
    console.error('   See docs/security/WALLET_SECURITY.md for more information.')
    process.exit(1)
  }
  
  console.log('Deploying with account:', deployer.account.address)
  
  const balance = await publicClient.getBalance({ address: deployer.account.address })
  console.log('Account balance:', (Number(balance) / 1e18).toFixed(4), 'ETH')
  
  if (Number(balance) < 0.01 * 10**18) {
    console.error('❌ ABORTING: Insufficient balance for deployment!')
    console.error('   Please fund your account with at least 0.01 ETH.')
    process.exit(1)
  }

  // Deploy BeatNFT Credit System
  const creditSystem = await viem.deployContract('BeatNFTCreditSystem', [deployer.account.address])
  
  console.log('✅ BeatNFT Credit System deployed to:', creditSystem.address)
  
  // Verify deployment by reading initial credits
  console.log('🔍 Verifying deployment...')
  try {
    const initialCredits = await publicClient.readContract({
      address: creditSystem.address,
      abi: [{
        type: 'function',
        name: 'getCreditBalance',
        inputs: [{ name: 'user', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view'
      }],
      functionName: 'getCreditBalance',
      args: [deployer.account.address]
    })
    console.log('Deployer initial credits:', initialCredits.toString())
  } catch (error) {
    console.log('Could not verify initial credits, but deployment successful')
  }
  
  // Display contract info
  console.log('\n📋 Contract Information:')
  console.log('Contract Address:', creditSystem.address)
  console.log('Owner:', deployer.account.address)
  console.log('Network: Sepolia')
  console.log('Chain ID: 11155111')
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: creditSystem.address,
    deployer: deployer.account.address,
    network: 'sepolia',
    chainId: 11155111,
    deployedAt: new Date().toISOString()
  }
  
  console.log('\n💾 Deployment completed successfully!')
  console.log('Add this address to your frontend configuration:')
  console.log(`BeatNFTCreditSystemAddress[${deploymentInfo.chainId}] = '${creditSystem.address}'`)
  
  // Instructions for verification
  console.log('\n🔍 To verify the contract on Etherscan:')
  console.log(`npx hardhat verify --network sepolia ${creditSystem.address} ${deployer.account.address}`)
  
  return { ...deploymentInfo, contractAddress: creditSystem.address }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error)
    process.exit(1)
  })