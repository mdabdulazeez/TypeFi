"use client";

import { useCallback, useEffect, useState } from 'react';
import { GameState, GameStats } from '@/types/game';
import { useTypingGame } from '@/hooks/useTypingGame';
import { InstructionsModal } from './InstructionsModal';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { useAccount, useBalance } from 'wagmi';
import { formatEther } from 'viem';
import { generateText } from '@/utils/words';

const GAME_DURATION = 60; // 60 seconds

export function TypingGame() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  
  const playerBalance = balance ? Number(formatEther(balance.value)) : 0;
  const hasEnoughForGas = playerBalance >= 0.01; // Need at least 0.01 STT for gas

  const [gameState, setGameState] = useState<GameState>({
    status: 'waiting',
    text: generateText(),
    input: '',
    startTime: null,
    endTime: null,
    stats: {
      wpm: 0,
      accuracy: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
      timeElapsed: 0,
    },
  });

  const calculateStats = useCallback((): GameStats => {
    if (!gameState.startTime) return gameState.stats;

    const { text, input, startTime } = gameState;
    const timeElapsed = Math.min((Date.now() - startTime) / 1000, GAME_DURATION);
    const words = Math.max(input.trim().split(/\s+/).length - 1, 0);
    const wpm = Math.round((words / timeElapsed) * 60);

    let correctChars = 0;
    let incorrectChars = 0;

    for (let i = 0; i < input.length; i++) {
      if (input[i] === text[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }

    const totalChars = correctChars + incorrectChars;
    const accuracy = totalChars === 0 ? 0 : Math.round((correctChars / totalChars) * 100);

    return {
      wpm,
      accuracy,
      correctChars,
      incorrectChars,
      totalChars,
      timeElapsed,
    };
  }, [gameState]);

  const { enterGame, submitScore } = useTypingGame();

  const startGame = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Entering typing game...');
      await enterGame();
      console.log('Game entered successfully! Starting typing challenge...');
      
      setGameState({
        ...gameState,
        status: 'playing',
        text: generateText(),
        input: '',
        startTime: Date.now(),
        endTime: null,
        stats: {
          wpm: 0,
          accuracy: 0,
          correctChars: 0,
          incorrectChars: 0,
          totalChars: 0,
          timeElapsed: 0,
        },
      });
    } catch (error: unknown) {
      console.error('Error starting game:', error);
      const message = error instanceof Error ? error.message : '';
      
      if (message.includes('Already entered')) {
        alert('You have already entered this game session. Try refreshing the page or wait for the next game round.');
      } else if (message.includes('rejected')) {
        alert('Transaction rejected. Game not started.');
      } else if (message.includes('insufficient funds')) {
        alert('Insufficient STT for gas fees. Please get more tokens from the faucet.');
      } else if (message.includes('gas')) {
        alert('Gas estimation failed. Please try again or refresh the page.');
      } else {
        const friendly = message ? message.split('(')[0] : 'Unknown error';
        alert(`Failed to start game: ${friendly}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [enterGame, gameState]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (gameState.status !== 'playing') return;

    const newInput = e.target.value;
    const sanitizedInput = newInput.replace(/[^a-zA-Z\s',.?!-]/g, '');
    
    if (sanitizedInput.length > gameState.text.length) return;

    const newStats = calculateStats();
    
    setGameState(prev => ({
      ...prev,
      input: sanitizedInput,
      stats: newStats,
    }));

    // Check if all words are typed correctly
    const inputWords = sanitizedInput.trim().split(/\s+/);
    const targetWords = gameState.text.trim().split(/\s+/);
    const allWordsTyped = inputWords.length === targetWords.length;
    const allWordsCorrect = allWordsTyped && 
      inputWords.every((word, index) => word === targetWords[index]);

    if (allWordsCorrect || newStats.timeElapsed >= GAME_DURATION) {
      const endTime = Date.now();
      setGameState(prev => ({ ...prev, status: 'finished', endTime }));
      submitScore(newStats.wpm, newStats.accuracy);
    }
  }, [gameState, calculateStats, submitScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        if (gameState.status === 'finished') {
          startGame();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status, startGame]);

  useEffect(() => {
    if (gameState.status === 'playing') {
      const timer = setInterval(() => {
        const newStats = calculateStats();
        setGameState(prev => ({ ...prev, stats: newStats }));

        if (newStats.timeElapsed >= GAME_DURATION) {
          setGameState(prev => ({ ...prev, status: 'finished', endTime: Date.now() }));
          submitScore(newStats.wpm, newStats.accuracy);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState.status, calculateStats, submitScore]);

  return (
    <div className="max-w-4xl mx-auto">
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Typing Challenge
            </h2>
            <button
              onClick={() => setShowInstructions(true)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Show instructions"
            >
              <QuestionMarkCircleIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {gameState.status === 'waiting' && (
              <button
                onClick={startGame}
                disabled={isLoading || !hasEnoughForGas}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  hasEnoughForGas
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? 'Starting...' : 'Start Game'}
              </button>
            )}
            {!hasEnoughForGas && (
              <p className="text-red-500 text-sm">Insufficient STT for gas</p>
            )}
          </div>
        </div>

        <div className="relative border rounded-lg p-6 bg-white shadow-sm">
          <div className="font-mono whitespace-pre-wrap mb-8 text-lg leading-relaxed h-[6em] relative">
            <div
              className="absolute w-full transition-all duration-300"
              style={{
                top: '0',
                opacity: '1'
              }}
            >
              {gameState.text.split(' ').map((word, i) => {
                const inputWords = gameState.input.split(' ');
                const isCurrentWord = i === inputWords.length - 1;
                const isTypedWord = i < inputWords.length - 1;
                const typedWord = inputWords[i] || '';

                return (
                  <span
                    key={i}
                    className={`${
                      isCurrentWord
                        ? 'bg-blue-100'
                        : isTypedWord
                        ? typedWord === word
                          ? 'text-green-600'
                          : 'text-red-500'
                        : ''
                    }`}
                  >
                    {word}{' '}
                  </span>
                );
              })}
            </div>
          </div>

          <textarea
            value={gameState.input}
            onChange={handleInput}
            disabled={gameState.status !== 'playing'}
            className="w-full p-4 border rounded-lg font-mono resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
            placeholder={
              gameState.status === 'waiting'
                ? 'Press Start Game to begin...'
                : gameState.status === 'finished'
                ? 'Game Over! Press Shift+Enter to play again'
                : 'Start typing...'
            }
          />

          <div className="mt-6 flex justify-between text-sm text-gray-600">
            <div className="space-x-4">
              <span>WPM: {gameState.stats.wpm}</span>
              <span>Accuracy: {gameState.stats.accuracy}%</span>
            </div>
            <div>
              Time: {Math.round(GAME_DURATION - gameState.stats.timeElapsed)}s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}