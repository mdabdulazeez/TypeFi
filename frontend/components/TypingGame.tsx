"use client";

import { useCallback, useEffect, useState } from 'react';
import { GameState, GameStats } from '@/types/game';
import { useTypingGame } from '@/hooks/useTypingGame';
import { generate } from 'random-words';
import { InstructionsModal } from './InstructionsModal';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { useAccount, useBalance } from 'wagmi';
import { formatEther } from 'viem';

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
    text: '',
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

  const { enterGame, submitScore } = useTypingGame();

  const generateText = useCallback(() => {
    const words = generate({ exactly: 50, join: ' ' });
    return words;
  }, []);

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
    } catch (error: any) {
      console.error('Error starting game:', error);
      
      // Show user-friendly error messages
      if (error.message?.includes('Already entered')) {
        alert('You have already entered this game session. Try refreshing the page or wait for the next game round.');
      } else if (error.message?.includes('rejected')) {
        alert('Transaction rejected. Game not started.');
      } else if (error.message?.includes('insufficient funds')) {
        alert('Insufficient STT for gas fees. Please get more tokens from the faucet.');
      } else if (error.message?.includes('gas')) {
        alert('Gas estimation failed. Please try again or refresh the page.');
      } else {
        alert(`Failed to start game: ${error.message?.split('(')[0] || 'Unknown error'}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [enterGame, gameState, generateText]);

  const calculateStats = useCallback((): GameStats => {
    const { text, input, startTime } = gameState;
    if (!startTime) return gameState.stats;

    const timeElapsed = (Date.now() - startTime) / 1000;
    const words = input.trim().split(' ').length;
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

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (gameState.status !== 'playing') return;

    const newInput = e.target.value;
    const newStats = calculateStats();

    setGameState(prev => ({
      ...prev,
      input: newInput,
      stats: newStats,
    }));

    // Check if game should end
    if (newInput === gameState.text || newStats.timeElapsed >= GAME_DURATION) {
      const endTime = Date.now();
      setGameState(prev => ({ ...prev, status: 'finished', endTime }));
      submitScore(newStats.wpm, newStats.accuracy);
    }
  }, [gameState, calculateStats, submitScore]);

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
              className="text-gray-400 hover:text-purple-400 transition-colors glow-hover"
            >
              <QuestionMarkCircleIcon className="h-6 w-6" />
            </button>
          </div>
          {gameState.status === 'playing' && (
            <div className="glass rounded-xl p-4 grid grid-cols-2 gap-6 border border-gray-700/50">
              <div className="text-center">
                <div className="text-sm text-gray-400 uppercase tracking-wide">WPM</div>
                <div className="text-2xl font-mono text-purple-300 font-bold">{gameState.stats.wpm}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 uppercase tracking-wide">Accuracy</div>
                <div className="text-2xl font-mono text-purple-300 font-bold">{gameState.stats.accuracy}%</div>
              </div>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-8 border border-gray-800/50">
          {gameState.status === 'waiting' ? (
            <div className="space-y-4">
              <div className="text-center text-sm text-gray-400">
                <p>Enter the typing challenge and compete!</p>
                <p>Your scores will be recorded on the leaderboard</p>
              </div>
              
              {!hasEnoughForGas ? (
                <div className="text-center space-y-3">
                  <p className="text-sm text-amber-300">
                    ⚠️ You need at least 0.01 STT for gas fees
                  </p>
                  <p className="text-xs text-gray-400">
                    Current balance: {playerBalance.toFixed(4)} STT
                  </p>
                  <p className="text-xs text-blue-300">
                    Get tokens from the faucet above to continue
                  </p>
                </div>
              ) : (
                <button
                  onClick={startGame}
                  disabled={isLoading}
                  className="w-full py-4 glass rounded-xl text-lg font-semibold text-gray-200 border border-gray-700/50 hover:border-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Entering Game...' : 'Start Typing Challenge'}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6 border border-gray-700/50">
                <p className="font-mono text-lg leading-relaxed text-gray-200 selection:bg-purple-500/30">
                  {gameState.text}
                </p>
              </div>
              <textarea
                value={gameState.input}
                onChange={handleInput}
                disabled={gameState.status === 'finished'}
                className="w-full h-40 p-4 glass rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-purple-400/50 border border-gray-700/50 text-gray-200 placeholder-gray-500 bg-transparent resize-none"
                placeholder="Start typing..."
              />
              {gameState.status === 'playing' && (
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Time: {Math.max(0, GAME_DURATION - Math.floor(gameState.stats.timeElapsed))}s</span>
                  <span>Progress: {Math.floor((gameState.input.length / gameState.text.length) * 100)}%</span>
                </div>
              )}
            </div>
          )}
        </div>

        {gameState.status === 'finished' && (
          <div className="glass rounded-2xl p-8 text-center space-y-6 border border-gray-800/50">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Game Complete!
            </h2>
            <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
              <div className="glass rounded-xl p-4 border border-gray-700/50">
                <div className="text-sm text-gray-400 uppercase tracking-wide">Final WPM</div>
                <div className="text-3xl font-mono text-pink-300 font-bold">{gameState.stats.wpm}</div>
              </div>
              <div className="glass rounded-xl p-4 border border-gray-700/50">
                <div className="text-sm text-gray-400 uppercase tracking-wide">Accuracy</div>
                <div className="text-3xl font-mono text-pink-300 font-bold">{gameState.stats.accuracy}%</div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-3 glass rounded-xl font-semibold text-gray-200 border border-gray-700/50 hover:border-pink-400/50 transition-all"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}