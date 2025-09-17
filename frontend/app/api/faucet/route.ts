import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Your wallet private key (keep this secure!)
const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;

export async function POST(request: NextRequest) {
  try {
    const { recipient, amount } = await request.json();

    if (!recipient || !amount) {
      return NextResponse.json({ error: 'Missing recipient or amount' }, { status: 400 });
    }

    if (!OWNER_PRIVATE_KEY) {
      return NextResponse.json({ error: 'Owner private key not configured' }, { status: 500 });
    }

    // Connect to Somnia Testnet
    const provider = new ethers.JsonRpcProvider('https://dream-rpc.somnia.network/');
    const wallet = new ethers.Wallet(OWNER_PRIVATE_KEY, provider);
    
    // Check recipient's current STT balance (native token)
    const recipientBalance = await provider.getBalance(recipient);
    const balanceInEther = Number(ethers.formatEther(recipientBalance));
    
    // Only send STT if recipient has less than 0.5 STT
    if (balanceInEther >= 0.5) {
      return NextResponse.json({ 
        error: 'Recipient already has sufficient STT tokens',
        balance: ethers.formatEther(recipientBalance),
        threshold: '0.5'
      }, { status: 400 });
    }

    // Send native STT tokens
    const amountWei = ethers.parseEther(amount);
    const tx = await wallet.sendTransaction({
      to: recipient,
      value: amountWei
    });
    
    console.log(`Sent ${amount} STT tokens to ${recipient}. Previous balance: ${balanceInEther}. Tx: ${tx.hash}`);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();

    return NextResponse.json({ 
      success: true, 
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      amount: amount,
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