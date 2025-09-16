const { ethers } = require('ethers');

// Configuration
const OWNER_PRIVATE_KEY = "6e8a898b02f478a157c8dcd23834b3f11d22f57130437f2b4a8e42ce8168b844";
const TEST_RECIPIENT = "0xB60743Be741381df45A4C643aD9CfcCad65685F9"; // Random test address

async function testFaucet() {
  try {
    console.log('🧪 Testing STT faucet functionality...\n');
    
    // Connect to Somnia Testnet
    const provider = new ethers.JsonRpcProvider('https://dream-rpc.somnia.network/');
    const wallet = new ethers.Wallet(OWNER_PRIVATE_KEY, provider);

    console.log('📊 Owner wallet:', wallet.address);
    console.log('🎯 Test recipient:', TEST_RECIPIENT);
    
    // Check owner STT balance
    const ownerBalance = await provider.getBalance(wallet.address);
    console.log('💰 Owner STT balance:', ethers.formatEther(ownerBalance), 'STT');
    
    // Check recipient STT balance before
    const recipientBalanceBefore = await provider.getBalance(TEST_RECIPIENT);
    console.log('📥 Recipient STT balance before:', ethers.formatEther(recipientBalanceBefore), 'STT');
    
    const balanceNum = Number(ethers.formatEther(recipientBalanceBefore));
    
    if (balanceNum >= 0.5) {
      console.log('⚠️  Recipient already has >= 0.5 STT, no transfer needed');
      return;
    }
    
    // Send 1 STT token
    console.log('\n📤 Sending 1 STT token...');
    const tx = await wallet.sendTransaction({
      to: TEST_RECIPIENT,
      value: ethers.parseEther("1.0")
    });
    console.log('⏳ Transaction hash:', tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed! Block:', receipt.blockNumber);
    
    // Check recipient STT balance after
    const recipientBalanceAfter = await provider.getBalance(TEST_RECIPIENT);
    console.log('📤 Recipient STT balance after:', ethers.formatEther(recipientBalanceAfter), 'STT');
    
    console.log('\n🎉 STT Faucet test successful!');
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  testFaucet();
}

module.exports = { testFaucet };