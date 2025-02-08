import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../lib/constants";

export const useBlockchain = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required!");
      return;
    }

    try {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3Signer = web3Provider.getSigner();
      const userAccount = await web3Signer.getAddress();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, web3Signer);

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(userAccount);
      setContract(contractInstance);

      console.log("✅ Wallet Connected:", userAccount);
    } catch (error) {
      console.error("❌ Error connecting wallet:", error);
    }
  };

  // 🔹 Add `listProperty` function here
  const listProperty = async (name, location, rentAmount) => {
    if (!contract) {
      console.error("❌ Contract not initialized!");
      return;
    }
    try {
      const tx = await contract.listProperty(name, location, ethers.utils.parseEther(rentAmount));
      await tx.wait();
      console.log("✅ Property Listed:", { name, location, rentAmount });
    } catch (error) {
      console.error("❌ Error listing property:", error);
    }
  };

  useEffect(() => {
    connectWallet(); // Auto-connect on load
  }, []);

  return { account, provider, signer, contract, connectWallet, listProperty };
};
