const hre = require('hardhat');
const { viem } = hre;

async function main() {
  console.log('🚀 Deploying BeatNFT contract to Sepolia...');
  
  // Get the deployer account
  const publicClient = await viem.getPublicClient();
  const [deployer] = await viem.getWalletClients();
  
  console.log('Deploying with account:', deployer.account.address);
  
  // Check balance
  const balance = await publicClient.getBalance({ address: deployer.account.address });
  console.log('Account balance:', balance.toString(), 'wei');
  console.log('Account balance:', (Number(balance) / 1e18).toFixed(4), 'ETH');
  
  if (balance === 0n) {
    console.log('❌ No ETH balance! Get test ETH from:');
    console.log('   - https://sepoliafaucet.com/');
    console.log('   - https://www.infura.io/faucet/sepolia');
    process.exit(1);
  }
  
  // Contract constructor parameters
  const initialOwner = '0xc84799A904EeB5C57aBBBc40176E7dB8be202C10';
  const platformFeeRecipient = '0xc84799A904EeB5C57aBBBc40176E7dB8be202C10';

  try {
    // Deploy the contract
    console.log('📦 Deploying contract...');
    const beatNFT = await viem.deployContract('BeatNFT', [initialOwner, platformFeeRecipient]);
    
    console.log('✅ BeatNFT deployed successfully!');
    console.log('📋 Contract details:');
    console.log('   - Address:', beatNFT.address);
    console.log('   - Deployer:', deployer.account.address);
    console.log('   - Initial Owner:', initialOwner);
    console.log('   - Platform Fee Recipient:', platformFeeRecipient);
    console.log('   - Network: Sepolia Testnet');
    console.log('   - Explorer: https://sepolia.etherscan.io/address/' + beatNFT.address);

    // Update environment variables
    console.log('\n🔧 Next steps:');
    console.log('1. Update your .env.local file:');
    console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${beatNFT.address}`);
    console.log('2. Update contract address in your frontend');
    console.log('3. Verify contract on Etherscan (optional)');
    
    return beatNFT.address;
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    if (error.message.includes('gas required exceeds allowance')) {
      console.log('💡 This usually means insufficient ETH balance for gas fees');
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });