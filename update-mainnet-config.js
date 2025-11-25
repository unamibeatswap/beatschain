#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get contract address from command line argument
const contractAddress = process.argv[2];

if (!contractAddress) {
  console.error('❌ Usage: node update-mainnet-config.js <CONTRACT_ADDRESS>');
  console.error('   Example: node update-mainnet-config.js 0x1234567890123456789012345678901234567890');
  process.exit(1);
}

// Validate contract address format
if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
  console.error('❌ Invalid contract address format');
  console.error('   Expected: 0x followed by 40 hexadecimal characters');
  process.exit(1);
}

console.log('🔧 Updating BeatsChain configuration for mainnet deployment...');
console.log('📋 Contract Address:', contractAddress);

// File paths
const envPath = path.join(__dirname, 'packages/app/.env.local');
const contractPath = path.join(__dirname, 'packages/app/src/contracts/BeatNFT.ts');

// Update .env.local
try {
  console.log('\n1. Updating .env.local...');
  
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update contract address
  envContent = envContent.replace(
    /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
    `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
  );
  
  // Update network ID to mainnet
  envContent = envContent.replace(
    /NEXT_PUBLIC_NETWORK_ID=.*/,
    'NEXT_PUBLIC_NETWORK_ID=1'
  );
  
  fs.writeFileSync(envPath, envContent);
  console.log('   ✅ Updated NEXT_PUBLIC_CONTRACT_ADDRESS');
  console.log('   ✅ Updated NEXT_PUBLIC_NETWORK_ID to 1 (mainnet)');
  
} catch (error) {
  console.error('   ❌ Failed to update .env.local:', error.message);
}

// Update BeatNFT.ts
try {
  console.log('\n2. Updating BeatNFT.ts...');
  
  let contractContent = fs.readFileSync(contractPath, 'utf8');
  
  // Update mainnet address in BeatNFTAddress object
  contractContent = contractContent.replace(
    /1: '0x[a-fA-F0-9]{40}'/,
    `1: '${contractAddress}'`
  );
  
  fs.writeFileSync(contractPath, contractContent);
  console.log('   ✅ Updated mainnet address in BeatNFTAddress');
  
} catch (error) {
  console.error('   ❌ Failed to update BeatNFT.ts:', error.message);
}

// Create deployment record
try {
  console.log('\n3. Creating deployment record...');
  
  const deploymentRecord = {
    contractAddress,
    network: 'mainnet',
    chainId: 1,
    deploymentDate: new Date().toISOString(),
    platformFee: '15%',
    owner: '0xc84799A904EeB5C57aBBBc40176E7dB8be202C10',
    feeRecipient: '0xc84799A904EeB5C57aBBBc40176E7dB8be202C10',
    etherscanUrl: `https://etherscan.io/address/${contractAddress}`,
    status: 'deployed'
  };
  
  const recordPath = path.join(__dirname, 'MAINNET_DEPLOYMENT_RECORD.json');
  fs.writeFileSync(recordPath, JSON.stringify(deploymentRecord, null, 2));
  console.log('   ✅ Created deployment record:', recordPath);
  
} catch (error) {
  console.error('   ❌ Failed to create deployment record:', error.message);
}

// Verification instructions
console.log('\n🎯 Configuration updated successfully!');
console.log('\n📋 Next Steps:');
console.log('1. Verify contract on Etherscan:');
console.log(`   npx hardhat verify --network mainnet ${contractAddress} "0xc84799A904EeB5C57aBBBc40176E7dB8be202C10" "0xc84799A904EeB5C57aBBBc40176E7dB8be202C10"`);

console.log('\n2. Test frontend connection:');
console.log('   cd packages/app');
console.log('   npm run dev');
console.log('   # Connect wallet to mainnet and test contract interaction');

console.log('\n3. Deploy frontend to production:');
console.log('   npm run build');
console.log('   # Deploy to Vercel with updated environment variables');

console.log('\n4. Monitor deployment:');
console.log(`   Etherscan: https://etherscan.io/address/${contractAddress}`);
console.log('   Watch for first transactions and verify functionality');

console.log('\n✅ BeatsChain mainnet configuration complete!');
console.log('🚀 Ready for production launch!');