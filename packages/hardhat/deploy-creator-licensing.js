const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying CreatorLicensing contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const CreatorLicensing = await ethers.getContractFactory("CreatorLicensing");
  const creatorLicensing = await CreatorLicensing.deploy(deployer.address);

  await creatorLicensing.waitForDeployment();
  const contractAddress = await creatorLicensing.getAddress();

  console.log("✅ CreatorLicensing deployed to:", contractAddress);
  console.log("📋 Platform fee:", "15% (1500 basis points)");
  console.log("👤 Owner:", deployer.address);

  // Verify contract on Etherscan (if on testnet/mainnet)
  const hre = require("hardhat");
  if (hre.network.name !== "hardhat") {
    console.log("⏳ Waiting for block confirmations...");
    await creatorLicensing.deploymentTransaction().wait(6);
    
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [deployer.address],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
    }
  }

  return contractAddress;
}

main()
  .then((address) => {
    console.log(`\n🎉 Deployment complete!`);
    console.log(`📝 Update CONTRACT_ADDRESS in useCreatorLicensing.ts to: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });