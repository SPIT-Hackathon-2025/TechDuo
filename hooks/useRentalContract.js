import { useState, useEffect } from "react";
import { useContract, useProvider, useSigner } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";

export function useRentalContract() {
  const provider = useProvider();
  const { data: signer } = useSigner();

  const contract = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    signerOrProvider: signer || provider,
  });

  const listProperty = async (name, location, rentAmount) => {
    try {
      const tx = await contract.listProperty(name, location, rentAmount);
      await tx.wait();
      console.log("Property Listed!");
    } catch (error) {
      console.error("Error listing property:", error);
    }
  };

  const getAllProperties = async () => {
    try {
      const properties = await contract.getAllProperties();
      return properties.map((p) => ({
        id: Number(p.id),
        owner: p.owner,
        name: p.name,
        location: p.location,
        rentAmount: Number(p.rentAmount),
        isAvailable: p.isAvailable,
      }));
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  };

  return { contract, listProperty, getAllProperties };
}
