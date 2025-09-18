import { ethers, run } from "hardhat";

async function main() {
  // Deploy TestToken first
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy();
  await testToken.waitForDeployment();
  console.log("TestToken deployed to:", await testToken.getAddress());

  // Deploy TypingGame with TestToken address
  const TypingGame = await hre.ethers.getContractFactory("TypingGame");
  const typingGame = await TypingGame.deploy(await testToken.getAddress());
  await typingGame.waitForDeployment();
  console.log("TypingGame deployed to:", await typingGame.getAddress());

  // Transfer some tokens to the game contract for initial rewards
  const initialGameBalance = hre.ethers.parseEther("10000"); // 10,000 tokens
  await testToken.transfer(await typingGame.getAddress(), initialGameBalance);
  console.log("Transferred initial game balance of 10,000 tokens");

  // Verify contracts on Somnia explorer (if supported)
  try {
    await hre.run("verify:verify", {
      address: await testToken.getAddress(),
      constructorArguments: [],
    });

    await hre.run("verify:verify", {
      address: await typingGame.getAddress(),
      constructorArguments: [await testToken.getAddress()],
    });
  } catch (e) {
    console.log("Verification might not be supported on Somnia testnet yet");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});