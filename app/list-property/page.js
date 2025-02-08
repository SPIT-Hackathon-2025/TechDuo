"use client";
import { useState } from "react";
import { useBlockchain } from "@/hooks/useBlockchain";

const ListPropertyPage = () => {
  const { account, listProperty } = useBlockchain();
  const [property, setProperty] = useState({ name: "", location: "", rent: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!listProperty) {
      console.error("❌ listProperty function is undefined!");
      return;
    }

    await listProperty(property.name, property.location, property.rent);
    alert("🏡 Property Listed Successfully!");
  };

  return (
    <div>
      <h1>List Your Property</h1>
      {account ? (
        <p>Connected as: {account}</p>
      ) : (
        <button onClick={useBlockchain}>Connect Wallet</button>
      )}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Property Name" onChange={(e) => setProperty({ ...property, name: e.target.value })} />
        <input type="text" placeholder="Location" onChange={(e) => setProperty({ ...property, location: e.target.value })} />
        <input type="number" placeholder="Rent Amount (ETH)" onChange={(e) => setProperty({ ...property, rent: e.target.value })} />
        <button type="submit">List Property</button>
      </form>
    </div>
  );
};

export default ListPropertyPage;
