const hre = require('hardhat');

async function main() {
  console.log('🔍 Checking mainnet deployment readiness...');
  
  const network = hre.network.name;
  console.log('Network:', network);
  
  if (network === 'mainnet') {
    const [deployer] = await hre.viem.getWalletClients();
    const publicClient = await hre.viem.getPublicClient();
    
    console.log('Deployer:', deployer.account.address);
    
    const balance = await publicClient.getBalance({ 
      address: deployer.account.address 
    });
    
    const balanceEth = Number(balance) / 1e18;
    console.log('Balance:', balanceEth.toFixed(6), 'ETH');
    
    if (balanceEth >= 0.05) {
      console.log('✅ Ready for mainnet deployment');
      return true;
    } else {
      console.log('❌ Need at least 0.05 ETH for deployment');
      console.log('💡 Add ETH to:', deployer.account.address);
      return false;
    }
  }
}

main().catch(console.error);