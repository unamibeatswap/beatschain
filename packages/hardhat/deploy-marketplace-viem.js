const hre = require('hardhat');
const { viem } = hre;

async function main() {
  console.log('🚀 Deploying BeatNFTMarketplace contract...');
  
  // Get the deployer account
  const publicClient = await viem.getPublicClient();
  const [deployer] = await viem.getWalletClients();
  
  console.log('Deploying with account:', deployer.account.address);
  
  // Contract constructor parameters
  const beatNFTContract = '0x8fa4e195010615d2376381e5de7a8099e2413d75'; // Existing BeatNFT contract
  const initialOwner = '0xc84799A904EeB5C57aBBBc40176E7dB8be202C10'; // Your super admin wallet

  // Deploy the contract
  const marketplace = await viem.deployContract('BeatNFTMarketplace', [beatNFTContract, initialOwner]);
  
  console.log('✅ BeatNFTMarketplace deployed to:', marketplace.address);
  console.log('📋 Contract details:');
  console.log('   - Address:', marketplace.address);
  console.log('   - Deployer:', deployer.account.address);
  console.log('   - Initial Owner:', initialOwner);
  console.log('   - BeatNFT Contract:', beatNFTContract);

  // Read contract details
  try {
    const platformFee = await publicClient.readContract({
      address: marketplace.address,
      abi: marketplace.abi,
      functionName: 'PLATFORM_FEE'
    });
    
    console.log('   - Platform Fee:', platformFee.toString(), 'basis points (15%)');
  } catch (error) {
    console.log('   - Contract details will be available after deployment confirmation');
  }

  console.log('\n🎯 Next steps:');
  console.log('1. Update MARKETPLACE_ADDRESS in .env.local to:', marketplace.address);
  console.log('2. Update MarketplaceAddress in frontend contracts');
  console.log('3. Test the contract deployment');
  console.log('4. Verify on Etherscan: https://sepolia.etherscan.io/address/' + marketplace.address);
  
  return marketplace.address;
}

main()
  .then((address) => {
    console.log(`\n🎉 BeatNFTMarketplace deployment complete!`);
    console.log(`📝 Contract Address: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });