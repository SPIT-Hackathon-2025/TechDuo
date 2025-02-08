// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RentalContract {
    struct Property {
        uint id;
        address owner;
        string name;
        string location;
        uint rentAmount;
        bool isAvailable;
    }

    Property[] public properties;
    uint public nextPropertyId;

    event PropertyListed(uint id, address owner, string name, string location, uint rentAmount);

    function listProperty(string memory _name, string memory _location, uint _rentAmount) public {
        properties.push(Property(nextPropertyId, msg.sender, _name, _location, _rentAmount, true));
        emit PropertyListed(nextPropertyId, msg.sender, _name, _location, _rentAmount);
        nextPropertyId++;
    }

    function getAllProperties() public view returns (Property[] memory) {
        return properties;
    }
}