const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy TestToken first
  const TestToken = await ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy();
  await testToken.waitForDeployment();
  const testTokenAddress = await testToken.getAddress();
  console.log("TestToken deployed to:", testTokenAddress);

  // Deploy TypingGame with TestToken address
  const TypingGame = await ethers.getContractFactory("TypingGame");
  const typingGame = await TypingGame.deploy(testTokenAddress);
  await typingGame.waitForDeployment();
  const gameAddress = await typingGame.getAddress();
  console.log("TypingGame deployed to:", gameAddress);

  // Transfer some tokens to the game contract for initial rewards
  const initialGameBalance = ethers.parseEther("10000"); // 10,000 tokens
  await testToken.transfer(gameAddress, initialGameBalance);
  console.log("Transferred initial game balance of 10,000 tokens");

  console.log("\nContract Addresses to add to your frontend config:");
  console.log("TYPING_GAME_ADDRESS =", gameAddress);
  console.log("TEST_TOKEN_ADDRESS =", testTokenAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });