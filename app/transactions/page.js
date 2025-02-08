"use client";
import { useBlockchain } from "@/hooks/useBlockchain";

const TransactionsPage = () => {
  const { account, connectWallet } = useBlockchain();

  return (
    <div>
      <h1>Transactions</h1>
      {account ? (
        <p>Connected as: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default TransactionsPage;
