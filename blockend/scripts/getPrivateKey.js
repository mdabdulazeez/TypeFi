const hre = require("hardhat");

async function main() {
  console.log("Getting private key from mnemonic...\n");
  
  const [signer] = await hre.ethers.getSigners();
  console.log("Wallet address:", signer.address);
  
  // Get private key through the wallet's privateKey property
  if (signer.privateKey) {
    console.log("Private key (without 0x):", signer.privateKey.slice(2));
  } else {
    // Alternative method to get private key from mnemonic
    const wallet = hre.ethers.Wallet.fromPhrase(process.env.MNEMONIC);
    console.log("Private key (without 0x):", wallet.privateKey.slice(2));
  }
  
  console.log("\n⚠️  SECURITY WARNING:");
  console.log("- Never share this private key");
  console.log("- Add it to frontend/.env.local");
  console.log("- Make sure .env.local is in .gitignore");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });