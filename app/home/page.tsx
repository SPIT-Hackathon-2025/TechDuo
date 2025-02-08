"use client";

import { useState } from "react";
import { useBlockchain } from "../../hooks/useBlockchain"; // Ensure correct path

export default function HomePage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [contractData, setContractData] = useState<string>("");

  const handleConnect = async () => {
    const blockchain = await useBlockchain();
    if (blockchain) {
      setWalletConnected(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!walletConnected ? (
        <button 
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600" 
          onClick={handleConnect}
        >
          Connect Wallet
        </button>
      ) : (
        <p className="mt-4 text-lg font-bold">Wallet Connected!</p>
      )}
    </div>
  );
}
