const hre = require('hardhat')

async function main() {
  // Get contract address and owner address from command line arguments
  const contractAddress = process.argv[2]
  const ownerAddress = process.argv[3]
  
  if (!contractAddress || !ownerAddress) {
    console.error('❌ Missing arguments!')
    console.error('Usage: node verify-contract.js <contractAddress> <ownerAddress>')
    process.exit(1)
  }
  
  console.log('🔍 Verifying BeatNFT Credit System on Etherscan...')
  console.log('Contract Address:', contractAddress)
  console.log('Owner Address:', ownerAddress)
  
  try {
    await hre.run('verify:verify', {
      address: contractAddress,
      constructorArguments: [ownerAddress],
      contract: 'contracts/BeatNFTCreditSystem.sol:BeatNFTCreditSystem'
    })
    
    console.log('✅ Contract verified successfully!')
    console.log(`View on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}`)
  } catch (error) {
    if (error.message.includes('Already Verified')) {
      console.log('✅ Contract already verified!')
      console.log(`View on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}`)
    } else {
      console.error('❌ Verification failed:', error)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Verification failed:', error)
    process.exit(1)
  })