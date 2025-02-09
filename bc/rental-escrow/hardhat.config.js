require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true, // Enables IR compilation for deeper stacks
    },
  },
  networks: {
    // localhost: { url: "http://127.0.0.1:8545" },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,  // Infura/Alchemy URL
      accounts: [process.env.PRIVATE_KEY], // Your wallet private key
    },
  },
};
