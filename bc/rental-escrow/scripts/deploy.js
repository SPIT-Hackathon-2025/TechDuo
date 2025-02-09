const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const RentalEscrow = await ethers.getContractFactory("RentalEscrow");
    const rentalEscrow = await RentalEscrow.deploy();
    
    await rentalEscrow.waitForDeployment(); // FIXED: Correct method

    const contractAddress = await rentalEscrow.getAddress(); // Get contract address
    console.log("RentalEscrow deployed to:", contractAddress);

    // Save contract address for later use
    fs.writeFileSync("./contractAddress.json", JSON.stringify({ address: contractAddress }, null, 2));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
