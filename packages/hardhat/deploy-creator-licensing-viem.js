const hre = require('hardhat');
const { viem } = hre;

async function main() {
  console.log('🚀 Deploying CreatorLicensing contract...');
  
  // Get the deployer account
  const publicClient = await viem.getPublicClient();
  const [deployer] = await viem.getWalletClients();
  
  console.log('Deploying with account:', deployer.account.address);
  
  // Contract constructor parameters
  const initialOwner = '0xc84799A904EeB5C57aBBBc40176E7dB8be202C10'; // Your super admin wallet

  // Deploy the contract
  const creatorLicensing = await viem.deployContract('CreatorLicensing', [initialOwner]);
  
  console.log('✅ CreatorLicensing deployed to:', creatorLicensing.address);
  console.log('📋 Contract details:');
  console.log('   - Address:', creatorLicensing.address);
  console.log('   - Deployer:', deployer.account.address);
  console.log('   - Initial Owner:', initialOwner);

  // Read contract details
  try {
    const platformFee = await publicClient.readContract({
      address: creatorLicensing.address,
      abi: creatorLicensing.abi,
      functionName: 'PLATFORM_FEE'
    });
    
    console.log('   - Platform Fee:', platformFee.toString(), 'basis points (15%)');
  } catch (error) {
    console.log('   - Contract details will be available after deployment confirmation');
  }

  console.log('\n🎯 Next steps:');
  console.log('1. Update CREATOR_LICENSING_ADDRESS in .env.local to:', creatorLicensing.address);
  console.log('2. Update CreatorLicensingAddress in frontend contracts');
  console.log('3. Test the contract deployment');
  console.log('4. Verify on Etherscan: https://sepolia.etherscan.io/address/' + creatorLicensing.address);
  
  return creatorLicensing.address;
}

main()
  .then((address) => {
    console.log(`\n🎉 CreatorLicensing deployment complete!`);
    console.log(`📝 Contract Address: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });