require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON request body

// Load environment variables
const RPC_URL = process.env.RPC_URL || "https://your_rpc_url_here";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

// Wallet Contract Details
const CONTRACT_ADDRESS = "0xaEE3f85774cCDD672d8691a9137A1c86fB565356"; // Replace with your deployed contract address
const ABI = [
    "function transferFunds(uint256 fromUserId, uint256 toUserId, uint256 amount) external"
];

// Initialize Provider & Wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

let transferInterval = null;
let transferAmount = 1; // Default transfer amount

// Transfer function (only from user 2 to user 3)
const transferFunds = async (amount) => {
    try {
        const tx = await contract.transferFunds(2, 3, amount);
        console.log(`Transfer from 2 to 3 initiated:`, tx.hash);
        await tx.wait();
        console.log(`✅ Transfer from 2 to 3 confirmed!`);
    } catch (error) {
        console.error(`❌ Error in transfer from 2 to 3:`, error);
    }
};

// Start automation
const startTransfers = () => {
    if (transferInterval) {
        console.log("⚠️ Transfer bot is already running.");
        return;
    }
    
    console.log("⏳ Transfer bot started...");
    transferInterval = setInterval(async () => {
        await (transferAmount);
    }, 60000);
};

// Stop automation
const stopTransfers = () => {
    if (transferInterval) {
        clearInterval(transferInterval);
        transferInterval = null;
        console.log("⛔ Transfer bot stopped.");
    } else {
        console.log("⚠️ Transfer bot is not running.");
    }
};

// API to start the bot with a custom amount
app.post("/start", (req, res) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).send("❌ Invalid amount. Please provide a valid positive number.");
    }

    transferAmount = amount;
    
    startTransfers();
    res.send(`✅ Transfer bot started with ${amount} from user 2 → 3.`);
});

// API to stop the bot
app.get("/stop", (req, res) => {
    stopTransfers();
    res.send("⛔ Transfer bot stopped.");
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
