const hre = require('hardhat')
const { viem } = hre

async function main() {
  console.log('🚀 Deploying BeatNFTCreditSystemV2 to Sepolia...')
  
  const publicClient = await viem.getPublicClient()
  const [deployer] = await viem.getWalletClients()
  
  // Security check for default hardhat account
  if (deployer.account.address.toLowerCase() === '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266') {
    console.error('❌ ABORTING: Refusing to deploy with default account to Sepolia!')
    console.error('   Please use a secure, private key for deployment to public networks.')
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

  // Deploy BeatNFT Credit System V2
  const creditSystemV2 = await viem.deployContract('BeatNFTCreditSystemV2', [deployer.account.address])
  
  console.log('✅ BeatNFTCreditSystemV2 deployed to:', creditSystemV2.address)
  
  // Verify deployment by reading initial credits
  console.log('🔍 Verifying deployment...')
  try {
    const initialCredits = await publicClient.readContract({
      address: creditSystemV2.address,
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
  console.log('Contract Address:', creditSystemV2.address)
  console.log('Owner:', deployer.account.address)
  console.log('Network: Sepolia')
  console.log('Chain ID: 11155111')
  console.log('Features: Storage tracking, size-based credits, 100MB limit')
  
  console.log('\n💾 Deployment completed successfully!')
  console.log('Add this address to your frontend configuration:')
  console.log(`BeatNFTCreditSystemV2Address[11155111] = '${creditSystemV2.address}'`)
  
  // Instructions for verification
  console.log('\n🔍 To verify the contract on Etherscan:')
  console.log(`npx hardhat verify --network sepolia ${creditSystemV2.address} ${deployer.account.address}`)
  
  return creditSystemV2.address
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error)
    process.exit(1)
  })