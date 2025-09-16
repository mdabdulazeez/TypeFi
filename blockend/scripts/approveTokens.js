const hre = require("hardhat");

async function main() {
  console.log("Approving tokens for TypingGame contract...\n");
  
  const testTokenAddress = "0x70329b878145E0856B15Df25506408d7f571b5F3";
  const typingGameAddress = "0x92Bc6B904D0d8673C8196320CEeEcece35B42937";
  
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const testToken = TestToken.attach(testTokenAddress);
  
  const [signer] = await hre.ethers.getSigners();
  console.log("Approving tokens from wallet:", signer.address);
  
  try {
    // Approve 1000 tokens (way more than needed, so you can play multiple games)
    const approveAmount = hre.ethers.parseEther("1000");
    
    console.log("Approving 1000 TEST tokens for TypingGame contract...");
    const tx = await testToken.approve(typingGameAddress, approveAmount);
    console.log("Transaction hash:", tx.hash);
    
    console.log("Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("✅ Approval confirmed! Block:", receipt.blockNumber);
    
    // Check the new allowance
    const allowance = await testToken.allowance(signer.address, typingGameAddress);
    console.log("New allowance:", hre.ethers.formatEther(allowance), "TEST tokens");
    
    console.log("\n🎉 You can now use the 'Enter' function in the game!");
    
  } catch (error) {
    console.error("Error approving tokens:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });