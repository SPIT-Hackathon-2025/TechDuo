// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/automation/KeeperCompatible.sol";


contract RentalEscrow is KeeperCompatibleInterface {
    struct Property {
        address payable landlord;
        address payable tenant;
        uint256 rentAmount;
        uint256 startDate;
        uint256 endDate;
        uint256 lastPaymentDate;
        bool isActive;
    }

    mapping(uint256 => Property) public properties;
    uint256 public nextPropertyId;

    event RentPaid(uint256 propertyId, uint256 amount);
    event PropertyTerminated(uint256 propertyId);

    function listProperty(
        address payable _tenant,
        uint256 _rentAmount,
        uint256 _startDate,
        uint256 _endDate
    ) public {
        properties[nextPropertyId] = Property(
            payable(msg.sender), // Landlord
            _tenant,
            _rentAmount,
            _startDate,
            _endDate,
            _startDate,
            true
        );
        nextPropertyId++;
    }

    function payRent(uint256 _propertyId) public payable {
        Property storage property = properties[_propertyId];
        require(property.isActive, "Rental inactive");
        require(msg.value == property.rentAmount, "Incorrect rent amount");

        property.landlord.transfer(msg.value);
        property.lastPaymentDate += 30 days;

        emit RentPaid(_propertyId, msg.value);
    }

    function terminateRental(uint256 _propertyId) public {
        Property storage property = properties[_propertyId];
        require(msg.sender == property.landlord || msg.sender == property.tenant, "Unauthorized");
        property.isActive = false;
        emit PropertyTerminated(_propertyId);
    }

    // Chainlink Automation (Check if rent needs to be paid)
    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory) {
        for (uint256 i = 0; i < nextPropertyId; i++) {
            Property storage property = properties[i];
            if (property.isActive && block.timestamp >= property.lastPaymentDate + 30 days) {
                return (true, abi.encode(i));
            }
        }
        return (false, "");
    }

    function performUpkeep(bytes calldata performData) external override {
        uint256 propertyId = abi.decode(performData, (uint256));
        payRent(propertyId);
    }
}
