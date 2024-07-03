const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleToken", function () {
  let SimpleToken;
  let simpleToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    SimpleToken = await ethers.getContractFactory("SimpleToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    simpleToken = await SimpleToken.deploy();
    await simpleToken.deployed();
  });

  it("Should have correct name and symbol", async function () {
    expect(await simpleToken.name()).to.equal("SimpleToken");
    expect(await simpleToken.symbol()).to.equal("STK");
  });

  it("Should mint tokens to owner upon deployment", async function () {
    const ownerBalance = await simpleToken.balanceOf(owner.address);
    expect(ownerBalance).to.equal(ethers.utils.parseEther("100000"));
  });

  it("Should allow owner to mint tokens", async function () {
    await simpleToken.mint(addr1.address, ethers.utils.parseEther("1000"));
    const addr1Balance = await simpleToken.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.utils.parseEther("1000"));
  });

  it("Should not allow minting beyond max supply", async function () {
    await expect(simpleToken.mint(addr1.address, ethers.utils.parseEther("1000000"))).to.be.revertedWith("Exceeds max supply");
  });

  it("Should allow users to withdraw", async function () {
    await simpleToken.mint(addr1.address, ethers.utils.parseEther("100"));
    await simpleToken.connect(addr1).approve(simpleToken.address, ethers.utils.parseEther("100"));
    await expect(() => simpleToken.connect(addr1).withdraw(ethers.utils.parseEther("100"))).to.changeEtherBalance(addr1, ethers.utils.parseEther("100"));
  });
});