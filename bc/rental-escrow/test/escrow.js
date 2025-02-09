const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow Contract", function () {
    let Escrow, escrow, landlord, tenant;

    beforeEach(async function () {
        [landlord, tenant] = await ethers.getSigners();
        Escrow = await ethers.getContractFactory("Escrow");
        escrow = await Escrow.deploy(
            landlord.address,
            tenant.address,
            ethers.utils.parseEther("0.1"),
            ethers.utils.parseEther("1"),
            Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60
        );
        await escrow.deployed();
    });

    it("should allow the tenant to pay rent", async function () {
        await escrow.connect(tenant).payRent({ value: ethers.utils.parseEther("0.1") });
        expect(await ethers.provider.getBalance(escrow.address)).to.equal(ethers.utils.parseEther("1"));
    });

    it("should allow the landlord to impose a penalty", async function () {
        await escrow.connect(landlord).imposePenalty(ethers.utils.parseEther("0.05"), "Late Payment");
        expect(await ethers.provider.getBalance(escrow.address)).to.equal(ethers.utils.parseEther("0.95"));
    });
});
