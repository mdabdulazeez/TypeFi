import { TYPING_GAME_ABI, TYPING_GAME_ADDRESS } from '@/config/contracts';
import { PlayerScore } from '@/types/game';
import { useReadContract, useWriteContract } from 'wagmi';

export function useTypingGame() {
  const { data: scores } = useReadContract({
    address: TYPING_GAME_ADDRESS,
    abi: TYPING_GAME_ABI,
    functionName: 'getScores',
  });

  const { writeContract: enterGame } = useWriteContract();
  const { writeContract: submitScore } = useWriteContract();

  const handleEnterGame = async () => {
    try {
      await enterGame({
        address: TYPING_GAME_ADDRESS,
        abi: TYPING_GAME_ABI,
        functionName: 'enter',
      });
    } catch (error) {
      console.error('Error entering game:', error);
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
  };
}