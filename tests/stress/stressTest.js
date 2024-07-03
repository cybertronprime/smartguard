const { ethers } = require("hardhat");

async function main() {
  const SimpleToken = await ethers.getContractFactory("SimpleToken");
  const simpleToken = await SimpleToken.deploy();
  await simpleToken.deployed();

  const [owner] = await ethers.getSigners();

  console.log("Starting stress test...");

  const userCounts = [100, 1000, 10000];

  for (const userCount of userCounts) {
    console.log(`Testing with ${userCount} users...`);

    const startTime = Date.now();
    const promises = [];

    for (let i = 0; i < userCount; i++) {
      promises.push(simpleToken.mint(owner.address, ethers.utils.parseEther("1")));
    }

    await Promise.all(promises);

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000; // Convert to seconds
    const tps = userCount / duration;

    console.log(`Completed ${userCount} transactions in ${duration.toFixed(2)} seconds`);
    console.log(`Transactions per second: ${tps.toFixed(2)}`);
    console.log("--------------------");
  }

  console.log("Stress test completed.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });