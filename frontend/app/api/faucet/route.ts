import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Faucet wallet
const FAUCET_PRIVATE_KEY = '6e8a898b02f478a157c8dcd23834b3f11d22f57130437f2b4a8e42ce8168b844';

export async function POST(request: NextRequest) {
  try {
    const { recipient } = await request.json();

    if (!recipient) {
      return NextResponse.json({ error: 'Missing recipient address' }, { status: 400 });
    }

    // Connect to Somnia Testnet
    const provider = new ethers.JsonRpcProvider('https://dream-rpc.somnia.network/');
    const wallet = new ethers.Wallet(FAUCET_PRIVATE_KEY, provider);
    // Check recipient's current STT balance
    const recipientBalance = await provider.getBalance(recipient);
    const balanceInEther = Number(ethers.formatEther(recipientBalance));
    
    console.log(`Recipient ${recipient} balance: ${balanceInEther} STT`);
    
    // Only send STT if recipient has less than 0.5 STT
    if (balanceInEther >= 0.5) {
      return NextResponse.json({ 
        message: 'You already have enough STT tokens to play!',
        balance: balanceInEther
      });
    }

    // Send 1 STT token
    const amountWei = ethers.parseEther('1.0');
    
    console.log(`Sending 1 STT to ${recipient}...`);
    
    // Check faucet wallet balance before sending
    const faucetBalance = await provider.getBalance(wallet.address);
    const faucetBalanceEth = Number(ethers.formatEther(faucetBalance));
    
    if (faucetBalanceEth < 1.1) {
      throw new Error(`Faucet is low on funds. Available: ${faucetBalanceEth.toFixed(2)} STT`);
    }
    
    const tx = await wallet.sendTransaction({
      to: recipient,
      value: amountWei,
      gasLimit: 21000, // Standard transfer gas limit
    });
    
    console.log(`Sent 1 STT to ${recipient}. Tx: ${tx.hash}`);
    
    await tx.wait();
    console.log(`Transaction confirmed: ${tx.hash}`);
    
    return NextResponse.json({ 
      success: true, 
      txHash: tx.hash,
      amount: '1.0',
      recipient: recipient
    });
    

  } catch (error: any) {
    console.error('Faucet error:', error);
    return NextResponse.json({ 
      error: 'Failed to send tokens', 
      details: error.message 
    }, { status: 500 });
  }
}