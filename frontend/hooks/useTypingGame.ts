"use client";

import { TYPING_GAME_ABI, TYPING_GAME_ADDRESS } from '@/config/contracts';
import { PlayerScore } from '@/types/game';
import { useReadContract, useWriteContract } from 'wagmi';

export function useTypingGame() {
  const { data: scores } = useReadContract({
    address: TYPING_GAME_ADDRESS,
    abi: TYPING_GAME_ABI,
    functionName: 'getScores',
  });

  const { writeContract: enterGame, isPending: isEnteringGame } = useWriteContract();
  const { writeContract: submitScore, isPending: isSubmittingScore } = useWriteContract();

  const handleEnterGame = async () => {
    try {
      console.log('Entering typing game...');
      console.log('Contract address:', TYPING_GAME_ADDRESS);
      console.log('Function: enter()');
      
      await enterGame({
        address: TYPING_GAME_ADDRESS,
        abi: TYPING_GAME_ABI,
        functionName: 'enter',
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
      await submitScore({
        address: TYPING_GAME_ADDRESS,
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
    submitScore: handleSubmitScore,
    isEnteringGame,
    isSubmittingScore,
  };
}