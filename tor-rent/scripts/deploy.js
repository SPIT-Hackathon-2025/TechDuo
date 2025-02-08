const hre = require("hardhat");

async function main() {
  const RentalContract = await hre.ethers.getContractFactory("RentalContract");
  const rentalContract = await RentalContract.deploy(); // Deploy the contract

  await rentalContract.waitForDeployment(); // Wait for deployment (Fix for .deployed issue)

  console.log(`RentalContract deployed to: ${await rentalContract.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });