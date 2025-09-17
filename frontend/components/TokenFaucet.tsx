"use client";

import { useState } from 'react';
import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { TEST_TOKEN_ADDRESS, TEST_TOKEN_ABI, TYPING_GAME_ADDRESS } from '@/config/contracts';
import { parseEther, formatEther } from 'viem';

export function TokenFaucet() {
  const [isGettingTokens, setIsGettingTokens] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  // Read user's token balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: TEST_TOKEN_ADDRESS,
    abi: TEST_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const getTokens = async () => {
    if (!address) return;
    
    setIsGettingTokens(true);
    try {
      await writeContract({
        address: TEST_TOKEN_ADDRESS,
        abi: TEST_TOKEN_ABI,
        functionName: 'faucet',
        args: [parseEther('100')], // Get 100 test tokens
      });
      
      // Refetch balance after a short delay
      setTimeout(() => {
        refetchBalance();
      }, 2000);
    } catch (error) {
      console.error('Error getting tokens:', error);
    } finally {
      setIsGettingTokens(false);
    }
  };

  const approveTokens = async () => {
    if (!address) return;
    
    setIsApproving(true);
    try {
      await writeContract({
        address: TEST_TOKEN_ADDRESS,
        abi: TEST_TOKEN_ABI,
        functionName: 'approve',
        args: [TYPING_GAME_ADDRESS, parseEther('1000')], // Approve 1000 tokens for the game
      });
    } catch (error) {
      console.error('Error approving tokens:', error);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-3">Test Tokens</h3>
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Balance: {balance ? formatEther(balance) : '0'} TEST tokens
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={getTokens}
            disabled={isGettingTokens}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isGettingTokens ? 'Getting Tokens...' : 'Get 100 Test Tokens'}
          </button>
          
          <button
            onClick={approveTokens}
            disabled={isApproving}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isApproving ? 'Approving...' : 'Approve Tokens for Game'}
          </button>
        </div>
        
        <p className="text-xs text-gray-500">
          1. Get test tokens first, then approve them for the game to use for staking.
        </p>
      </div>
    </div>
  );
}