async function main() {
  console.log("🚀 Deploying CreatorLicensing contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const CreatorLicensing = await ethers.getContractFactory("CreatorLicensing");
  const creatorLicensing = await CreatorLicensing.deploy(deployer.address);

  await creatorLicensing.waitForDeployment();
  const contractAddress = await creatorLicensing.getAddress();

  console.log("✅ CreatorLicensing deployed to:", contractAddress);
  console.log("📋 Platform fee: 15% (1500 basis points)");
  console.log("👤 Owner:", deployer.address);

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