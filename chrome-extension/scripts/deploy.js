const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying with account:", deployer.address);
  
  const BeatsChain = await ethers.getContractFactory("BeatsChainMusicNFTs");
  const contract = await BeatsChain.deploy(
    "BeatsChain Music NFTs",
    "BEATS", 
    deployer.address,
    500 // 5% royalty
  );
  
  await contract.waitForDeployment();
  
  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});