const hre = require("hardhat");

async function main() {
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace this with real address
    if (contractAddress === "0xYourContractAddress") {
        console.error("❌ ERROR: Please replace 0xYourContractAddress with your real deployed address!");
        return;
    }

    const RentalEscrow = await hre.ethers.getContractFactory("RentalEscrow");
    const rentalEscrow = RentalEscrow.attach(contractAddress); // Attach, don’t deploy

    console.log("✅ Contract attached at:", rentalEscrow.address);
    return rentalEscrow;
}

// Run
main().catch(console.error);
