import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Faucet wallet - NEVER hardcode private keys!
const FAUCET_PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY;

export async function POST(request: NextRequest) {
  try {
    // Security check - ensure private key is configured
    if (!FAUCET_PRIVATE_KEY) {
      console.error('FAUCET_PRIVATE_KEY environment variable is not set');
      return NextResponse.json({ 
        error: 'Faucet service unavailable',
        details: 'Server configuration error - contact administrator'
      }, { status: 503 });
    }
    
    const { recipient } = await request.json();

    if (!recipient) {
      return NextResponse.json({ error: 'Missing recipient address' }, { status: 400 });
    }

    // Connect to Somnia Testnet
    const provider = new ethers.JsonRpcProvider('https://dream-rpc.somnia.network/');
    const wallet = new ethers.Wallet(FAUCET_PRIVATE_KEY, provider);
    
    // Check faucet wallet balance first
    const faucetBalance = await provider.getBalance(wallet.address);
    const faucetBalanceEth = Number(ethers.formatEther(faucetBalance));
    
    console.log(`Faucet wallet ${wallet.address} balance: ${faucetBalanceEth} STT`);
    
    // Check if faucet has enough balance (need at least 1.01 STT - 1 for transfer + 0.01 for gas)
    if (faucetBalanceEth < 1.01) {
      return NextResponse.json({ 
        error: 'Faucet is empty', 
        details: `Faucet wallet needs more STT. Current balance: ${faucetBalanceEth.toFixed(4)} STT. Please fund the faucet wallet: ${wallet.address}`
      }, { status: 503 });
    }
    
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
    
    // Get current gas price from network
    const feeData = await provider.getFeeData();
    console.log('Fee data:', {
      gasPrice: feeData.gasPrice?.toString(),
      maxFeePerGas: feeData.maxFeePerGas?.toString(),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString()
    });
    
    // Estimate gas for the transaction
    let gasEstimate;
    try {
      gasEstimate = await provider.estimateGas({
        to: recipient,
        value: amountWei,
        from: wallet.address
      });
      console.log('Gas estimate:', gasEstimate.toString());
    } catch (estimateError) {
      console.error('Gas estimation failed:', estimateError);
      gasEstimate = 21000n; // fallback to standard transfer gas
    }
    
    // Get the current nonce
    const nonce = await provider.getTransactionCount(wallet.address, 'pending');
    console.log('Using nonce:', nonce);
    
    const txParams = {
      to: recipient,
      value: amountWei,
      gasLimit: gasEstimate,
      nonce: nonce,
    };
    
    // Add gas price based on network support
    if (feeData.gasPrice) {
      txParams.gasPrice = feeData.gasPrice;
    } else if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
      txParams.maxFeePerGas = feeData.maxFeePerGas;
      txParams.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
    }
    
    console.log('Transaction params:', txParams);
    
    const tx = await wallet.sendTransaction(txParams);
    
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