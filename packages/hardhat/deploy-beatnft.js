const hre = require('hardhat');
const { viem } = hre;

async function main() {
  console.log('🚀 Deploying BeatNFT contract...');
  
  // Get the deployer account
  const publicClient = await viem.getPublicClient();
  const [deployer] = await viem.getWalletClients();
  
  console.log('Deploying with account:', deployer.account.address);
  
  // Contract constructor parameters
  const initialOwner = '0xc84799A904EeB5C57aBBBc40176E7dB8be202C10'; // Your super admin wallet
  const platformFeeRecipient = '0xc84799A904EeB5C57aBBBc40176E7dB8be202C10'; // Same wallet for fees

  // Deploy the contract
  const beatNFT = await viem.deployContract('BeatNFT', [initialOwner, platformFeeRecipient]);
  
  console.log('✅ BeatNFT deployed to:', beatNFT.address);
  console.log('📋 Contract details:');
  console.log('   - Address:', beatNFT.address);
  console.log('   - Deployer:', deployer.account.address);
  console.log('   - Initial Owner:', initialOwner);
  console.log('   - Platform Fee Recipient:', platformFeeRecipient);

  // Read contract details
  try {
    const name = await publicClient.readContract({
      address: beatNFT.address,
      abi: beatNFT.abi,
      functionName: 'name'
    });
    
    const symbol = await publicClient.readContract({
      address: beatNFT.address,
      abi: beatNFT.abi,
      functionName: 'symbol'
    });
    
    const platformFee = await publicClient.readContract({
      address: beatNFT.address,
      abi: beatNFT.abi,
      functionName: 'platformFeePercentage'
    });
    
    console.log('   - Name:', name);
    console.log('   - Symbol:', symbol);
    console.log('   - Platform Fee:', platformFee.toString(), 'basis points (15%)');
  } catch (error) {
    console.log('   - Contract details will be available after deployment confirmation');
  }

  console.log('\n🎯 Next steps:');
  console.log('1. Update NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local to:', beatNFT.address);
  console.log('2. Update BeatNFTAddress in packages/app/src/contracts/BeatNFT.ts');
  console.log('3. Test the contract deployment');
  console.log('4. Verify on Etherscan: https://sepolia.etherscan.io/address/' + beatNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });