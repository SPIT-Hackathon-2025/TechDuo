"use client";
import { useState, useEffect } from "react";
import { useBlockchain } from "@/hooks/useBlockchain";
import { ethers } from "ethers";

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const { getProperties } = await useBlockchain();
      const fetchedProperties = await getProperties();
      setProperties(fetchedProperties);
    };

    fetchProperties();
  }, []);

  return (
    <div>
      <h1>Available Properties</h1>
      {properties.length > 0 ? (
        <ul>
          {properties.map((property, index) => (
            <li key={index}>
              <strong>Owner:</strong> {property.owner} <br />
              <strong>Name:</strong> {property.name} <br />
              <strong>Location:</strong> {property.location} <br />
              <strong>Rent:</strong> {ethers.utils.formatEther(property.rentAmount)} ETH
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>No properties listed yet.</p>
      )}
    </div>
  );
};

export default PropertiesPage;
