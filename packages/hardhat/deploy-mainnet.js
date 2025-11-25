const hre = require('hardhat');
const { viem } = hre;

async function main() {
  console.log('🚀 BeatsChain Mainnet Deployment Starting...\n');
  
  // Pre-deployment checks
  console.log('🔍 Pre-deployment verification:');
  
  // Check network
  const network = hre.network.name;
  if (network !== 'mainnet') {
    throw new Error(`❌ Wrong network! Expected 'mainnet', got '${network}'`);
  }
  console.log('   ✅ Network: Mainnet');
  
  // Get deployer account
  const publicClient = await viem.getPublicClient();
  const [deployer] = await viem.getWalletClients();
  const deployerAddress = deployer.account.address;
  
  console.log('   ✅ Deployer:', deployerAddress);
  
  // Check deployer balance
  const balance = await publicClient.getBalance({ address: deployerAddress });
  const balanceEth = Number(balance) / 1e18;
  console.log('   ✅ Balance:', balanceEth.toFixed(4), 'ETH');
  
  if (balanceEth < 0.05) {
    throw new Error('❌ Insufficient balance! Need at least 0.05 ETH for deployment');
  }
  
  // Verify expected addresses
  const expectedOwner = '0xc84799A904EeB5C57aBBBc40176E7dB8be202C10';
  if (deployerAddress.toLowerCase() !== expectedOwner.toLowerCase()) {
    throw new Error(`❌ Wrong deployer! Expected ${expectedOwner}, got ${deployerAddress}`);
  }
  console.log('   ✅ Deployer verified as super admin wallet');
  
  // Contract parameters
  const initialOwner = expectedOwner;
  const platformFeeRecipient = expectedOwner;
  
  console.log('\n📋 Contract Configuration:');
  console.log('   - Initial Owner:', initialOwner);
  console.log('   - Platform Fee Recipient:', platformFeeRecipient);
  console.log('   - Expected Platform Fee: 15% (1500 basis points)');
  
  // Estimate gas
  console.log('\n⛽ Gas Estimation:');
  try {
    const gasPrice = await publicClient.getGasPrice();
    const gasPriceGwei = Number(gasPrice) / 1e9;
    console.log('   - Current Gas Price:', gasPriceGwei.toFixed(2), 'gwei');
    
    const estimatedGas = 2500000; // Conservative estimate
    const estimatedCostEth = (Number(gasPrice) * estimatedGas) / 1e18;
    console.log('   - Estimated Gas:', estimatedGas.toLocaleString());
    console.log('   - Estimated Cost:', estimatedCostEth.toFixed(4), 'ETH');
    
    if (estimatedCostEth > balanceEth * 0.8) {
      console.log('   ⚠️  Warning: High gas cost relative to balance');
    }
  } catch (error) {
    console.log('   ⚠️  Could not estimate gas, proceeding with deployment');
  }
  
  // Final confirmation
  console.log('\n🎯 Ready to deploy BeatNFT to Mainnet');
  console.log('   - This will create a new contract with 15% platform fee');
  console.log('   - Contract will be owned by:', initialOwner);
  console.log('   - Platform fees will go to:', platformFeeRecipient);
  
  // Deploy the contract
  console.log('\n🚀 Deploying BeatNFT contract...');
  
  const startTime = Date.now();
  const beatNFT = await viem.deployContract('BeatNFT', [initialOwner, platformFeeRecipient]);
  const deployTime = Date.now() - startTime;
  
  console.log('\n✅ BeatNFT deployed successfully!');
  console.log('📋 Deployment Details:');
  console.log('   - Contract Address:', beatNFT.address);
  console.log('   - Transaction Hash:', beatNFT.transactionHash);
  console.log('   - Deployment Time:', (deployTime / 1000).toFixed(2), 'seconds');
  console.log('   - Network: Ethereum Mainnet');
  console.log('   - Deployer:', deployerAddress);
  
  // Verify contract details
  console.log('\n🔍 Verifying contract configuration...');
  
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
    
    const owner = await publicClient.readContract({
      address: beatNFT.address,
      abi: beatNFT.abi,
      functionName: 'owner'
    });
    
    const feeRecipient = await publicClient.readContract({
      address: beatNFT.address,
      abi: beatNFT.abi,
      functionName: 'platformFeeRecipient'
    });
    
    console.log('   ✅ Name:', name);
    console.log('   ✅ Symbol:', symbol);
    console.log('   ✅ Platform Fee:', platformFee.toString(), 'basis points');
    console.log('   ✅ Owner:', owner);
    console.log('   ✅ Fee Recipient:', feeRecipient);
    
    // Verify configuration
    if (platformFee.toString() !== '1500') {
      console.log('   ⚠️  Warning: Platform fee is not 15% (1500 basis points)');
    }
    
    if (owner.toLowerCase() !== initialOwner.toLowerCase()) {
      console.log('   ⚠️  Warning: Owner does not match expected address');
    }
    
    if (feeRecipient.toLowerCase() !== platformFeeRecipient.toLowerCase()) {
      console.log('   ⚠️  Warning: Fee recipient does not match expected address');
    }
    
  } catch (error) {
    console.log('   ⚠️  Could not verify contract details immediately');
    console.log('   ℹ️  Contract details will be available after block confirmation');
  }
  
  // Next steps
  console.log('\n🎯 Next Steps:');
  console.log('1. Update frontend configuration:');
  console.log('   - Update NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local to:', beatNFT.address);
  console.log('   - Update BeatNFTAddress in packages/app/src/contracts/BeatNFT.ts');
  console.log('   - Set NEXT_PUBLIC_NETWORK_ID=1 for mainnet');
  
  console.log('\n2. Verify contract on Etherscan:');
  console.log('   npx hardhat verify --network mainnet', beatNFT.address, `"${initialOwner}"`, `"${platformFeeRecipient}"`);
  
  console.log('\n3. Test contract functionality:');
  console.log('   - Connect wallet to mainnet');
  console.log('   - Test read functions');
  console.log('   - Test small transaction');
  
  console.log('\n4. Monitor deployment:');
  console.log('   - Etherscan:', `https://etherscan.io/address/${beatNFT.address}`);
  console.log('   - Transaction:', `https://etherscan.io/tx/${beatNFT.transactionHash}`);
  
  console.log('\n🎉 BeatsChain Mainnet Deployment Complete!');
  console.log('📝 Save this information for your records:');
  console.log('   Contract Address:', beatNFT.address);
  console.log('   Transaction Hash:', beatNFT.transactionHash);
  console.log('   Deployment Date:', new Date().toISOString());
  
  return {
    contractAddress: beatNFT.address,
    transactionHash: beatNFT.transactionHash,
    deployerAddress,
    platformFee: '1500',
    network: 'mainnet'
  };
}

main()
  .then((result) => {
    console.log('\n✅ Deployment successful!');
    console.log('📋 Final Summary:', JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Deployment failed:');
    console.error(error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check wallet balance (need ~0.05 ETH)');
    console.error('2. Verify network connection');
    console.error('3. Confirm environment variables');
    console.error('4. Check gas prices (may be too high)');
    process.exit(1);
  });