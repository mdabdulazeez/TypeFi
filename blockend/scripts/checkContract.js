const hre = require("hardhat");

async function main() {
  console.log("Checking contract status...\n");
  
  // Get the contract instances
  const testTokenAddress = "0x70329b878145E0856B15Df25506408d7f571b5F3";
  const typingGameAddress = "0x92Bc6B904D0d8673C8196320CEeEcece35B42937";
  
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const testToken = TestToken.attach(testTokenAddress);
  
  const TypingGame = await hre.ethers.getContractFactory("TypingGame");
  const typingGame = TypingGame.attach(typingGameAddress);
  
  // Get the first account (your wallet)
  const [signer] = await hre.ethers.getSigners();
  console.log("Your wallet address:", signer.address);
  
  try {
    // Check TestToken balance
    const balance = await testToken.balanceOf(signer.address);
    console.log("Your TEST token balance:", hre.ethers.formatEther(balance));
    
    // Check if you've already entered the game
    const hasEntered = await typingGame.hasEntered(signer.address);
    console.log("Have you already entered the game?", hasEntered);
    
    // Check the entry stake amount
    const entryStake = await typingGame.entryStake();
    console.log("Entry stake required:", hre.ethers.formatEther(entryStake), "TEST tokens");
    
    // Check allowance
    const allowance = await testToken.allowance(signer.address, typingGameAddress);
    console.log("Current allowance for TypingGame:", hre.ethers.formatEther(allowance));
    
    // Check token contract address in TypingGame
    const tokenAddress = await typingGame.token();
    console.log("Token address in TypingGame:", tokenAddress);
    console.log("Expected TestToken address:", testTokenAddress);
    console.log("Addresses match:", tokenAddress.toLowerCase() === testTokenAddress.toLowerCase());
    
  } catch (error) {
    console.error("Error checking contracts:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });