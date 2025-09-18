"use client";

import { TYPING_GAME_ABI, TYPING_GAME_ADDRESS, TEST_TOKEN_ADDRESS } from '@/config/contracts';
import { PlayerScore } from '@/types/game';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';

export function useTypingGame() {
  const { data: scores } = useReadContract({
    address: TYPING_GAME_ADDRESS,
    abi: TYPING_GAME_ABI,
    functionName: 'getScores',
  });

  const { writeContract } = useWriteContract();
  const { isConnected } = useAccount();

  const TOKEN_ABI = [
    {
      name: 'approve',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      outputs: [{ type: 'bool' }]
    }
  ] as const;

  const handleEnterGame = async () => {
    try {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      console.log('Checking token approval...');
      
      // First approve tokens
      try {
        const config = {
          address: TEST_TOKEN_ADDRESS as `0x${string}`,
          abi: TOKEN_ABI,
          functionName: 'approve',
          args: [TYPING_GAME_ADDRESS as `0x${string}`, BigInt('10000000000000000000')], // 10 tokens
          chainId: 50312 // Somnia Testnet
        } as const;

        await writeContract(config);
        await new Promise(r => setTimeout(r, 3000)); // Wait for transaction to be mined
        console.log('✅ Token approval successful');
      } catch (approveError: any) {
        console.error('Token approval failed:', approveError);
        if (approveError.message?.includes('insufficient funds')) {
          throw new Error('Insufficient SOM for gas fees. Please get some SOM from the faucet.');
        }
        throw new Error(`Failed to approve tokens: ${approveError.message}`);
      }

      console.log('Entering typing game...');
      console.log('Contract address:', TYPING_GAME_ADDRESS);
      
      // Now enter the game
      await writeContract({
        address: TYPING_GAME_ADDRESS as `0x${string}`,
        abi: TYPING_GAME_ABI,
        functionName: 'enter',
        chainId: 50312 // Somnia Testnet
      });
      
      console.log('✅ Enter game transaction sent successfully!');
    } catch (error: any) {
      console.error('❌ Error entering game:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        data: error.data
      });
      throw error;
    }
  };

  const handleSubmitScore = async (wpm: number, accuracy: number) => {
    try {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      await writeContract({
        address: TYPING_GAME_ADDRESS as `0x${string}`,
        abi: TYPING_GAME_ABI,
        functionName: 'submitScore',
        args: [BigInt(wpm), BigInt(accuracy)],
      });
    } catch (error) {
      console.error('Error submitting score:', error);
      throw error;
    }
  };

  return {
    scores: scores as PlayerScore[] | undefined,
    enterGame: handleEnterGame,
    submitScore: handleSubmitScore
  };
}